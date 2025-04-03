module dex::main;

use dex::admin::{Admin, get_admin_address};
use dex::pool::{Self, Pool, update_bids, update_offers};
use dex::prover;
use dex::token;
use dex::user::{UserTradingAccount, copy_user_trading_account};
use std::string::String;
use sui::clock::{timestamp_ms, Clock};
use sui::display;
use sui::event;
use sui::hash::blake2b256;
use sui::object_table;
use sui::package;

const DEX_VERSION: u32 = 1;

public struct BlockState has key, store {
    id: UID,
    name: String,
    block_number: u64,
    sequence: u64,
    users: vector<u256>,
    state: object_table::ObjectTable<u256, UserTradingAccount>,
}

public struct Block has key, store {
    id: UID,
    name: String,
    block_number: u64,
    start_sequence: u64,
    end_sequence: u64,
    block_state: BlockState,
    time_since_last_block: u64,
    number_of_transactions: u64,
    start_action_state: vector<u8>,
    end_action_state: vector<u8>,
    state_data_availability: Option<String>,
    proof_data_availability: Option<String>,
    mina_tx_hash: Option<String>,
    mina_tx_included_in_block: bool,
    created_at: u64,
    state_calculated_at: Option<u64>,
    proved_at: Option<u64>,
    sent_to_mina_at: Option<u64>,
    settled_on_mina_at: Option<u64>,
}

public struct BlockEvent has copy, drop {
    address: address,
    name: String,
    block_number: u64,
    start_sequence: u64,
    end_sequence: u64,
    timestamp: u64,
    time_since_last_block: u64,
    number_of_transactions: u64,
    start_action_state: vector<u8>,
    end_action_state: vector<u8>,
}

public struct DataAvailabilityEvent has copy, drop {
    block_number: u64,
    state_data_availability: Option<String>,
    proof_data_availability: Option<String>,
    state_calculated_at: u64,
    proof_calculated_at: Option<u64>,
}

public struct MinaTransactionEvent has copy, drop {
    block_number: u64,
    start_sequence: u64,
    end_sequence: u64,
    state_data_availability: String,
    proof_data_availability: Option<String>,
    mina_tx_hash: String,
    mina_tx_included_in_block: bool,
    sent_to_mina_at: u64,
    settled_on_mina_at: Option<u64>,
}

public struct DEX has key, store {
    id: UID,
    name: String,
    sequence: u64,
    block_number: u64,
    actionsState: vector<u8>,
    proof_calculations: object_table::ObjectTable<
        u64,
        prover::ProofCalculation,
    >,
    blocks: object_table::ObjectTable<u64, Block>,
    admin: address,
    public_key: vector<u8>,
    circuit: prover::Circuit,
    circuit_address: address,
    pool: Pool,
    version: u32,
    previous_block_timestamp: u64,
    previous_block_last_sequence: u64,
    previous_block_actions_state: vector<u8>,
    last_proved_block_number: u64,
    last_proved_sequence: u64,
    isPaused: bool,
}

public struct DEXCreateEvent has copy, drop {
    address: address,
    admin: address,
    version: u32,
    actionsState: vector<u8>,
    timestamp: u64,
}

public struct MAIN has drop {}

fun init(otw: MAIN, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let dex_keys = vector[
        b"name".to_string(),
        b"description".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let dex_values = vector[
        b"Silvana DEX".to_string(),
        b"Silvana DEX is a decentralized exchange for the Mina protocol".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"DFST".to_string(),
    ];
    let mut display_dex = display::new_with_fields<DEX>(
        &publisher,
        dex_keys,
        dex_values,
        ctx,
    );

    let block_keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"image_url".to_string(),
        b"thumbnail_url".to_string(),
        b"description".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let block_values = vector[
        b"{name}".to_string(),
        b"https://walruscan.com/testnet/blob/{state_data_availability}".to_string(),
        b"{image}".to_string(),
        b"{image}".to_string(),
        b"{role}".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"DFST".to_string(),
    ];
    let mut display_block = display::new_with_fields<Block>(
        &publisher,
        block_keys,
        block_values,
        ctx,
    );

    display_dex.update_version();
    display_block.update_version();
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display_dex, ctx.sender());
    transfer::public_transfer(display_block, ctx.sender());
}

public fun create_dex(
    admin: &Admin,
    public_key: vector<u8>,
    // Circuit
    circuit_name: String,
    circuit_description: String,
    circuit_package_da_hash: String,
    circuit_verification_key_hash: u256,
    circuit_verification_key_data: String,
    // Token 1
    base_token_publicKey: u256,
    base_token_publicKeyBase58: String,
    base_token_tokenId: u256,
    base_token_token: String,
    base_token_name: String,
    base_token_description: String,
    base_token_image: String,
    // Token 2
    quote_token_publicKey: u256,
    quote_token_publicKeyBase58: String,
    quote_token_tokenId: u256,
    quote_token_token: String,
    quote_token_name: String,
    quote_token_description: String,
    quote_token_image: String,
    // Pool
    pool_name: String,
    pool_publicKey: u256,
    pool_publicKeyBase58: String,
    initial_price: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(get_admin_address(admin) == ctx.sender(), ENotAuthorized);
    let timestamp = clock.timestamp_ms();
    let bytes = vector<u8>[0];
    let hash = blake2b256(&bytes);
    let (circuit, circuit_address) = prover::create_circuit(
        circuit_name,
        circuit_description,
        circuit_package_da_hash,
        circuit_verification_key_hash,
        circuit_verification_key_data,
        clock,
        ctx,
    );
    let (base_token, base_token_event) = token::create_token(
        admin,
        base_token_publicKey,
        base_token_publicKeyBase58,
        base_token_tokenId,
        base_token_token,
        base_token_name,
        base_token_description,
        base_token_image,
        ctx,
    );
    let (quote_token, quote_token_event) = token::create_token(
        admin,
        quote_token_publicKey,
        quote_token_publicKeyBase58,
        quote_token_tokenId,
        quote_token_token,
        quote_token_name,
        quote_token_description,
        quote_token_image,
        ctx,
    );
    let pool = pool::create_pool(
        admin,
        pool_name,
        pool_publicKey,
        pool_publicKeyBase58,
        base_token,
        quote_token,
        base_token_event,
        quote_token_event,
        initial_price,
        clock,
        ctx,
    );

    let (block_timestamp, block_0) = create_block_internal(
        0u64,
        0u64,
        0u64,
        &pool,
        hash,
        vector<u8>[],
        option::none(),
        clock,
        ctx,
    );
    let mut blocks = object_table::new<u64, Block>(ctx);
    blocks.add(0u64, block_0);

    let (proof_calculation_block_1, _) = prover::create_block_proof_calculation(
        1u64,
        circuit_address,
        1u64,
        option::none(),
        clock,
        ctx,
    );
    let mut proof_calculations = object_table::new<
        u64,
        prover::ProofCalculation,
    >(ctx);
    proof_calculations.add(1u64, proof_calculation_block_1);

    let dex = DEX {
        id: object::new(ctx),
        name: b"Silvana DEX".to_string(),
        sequence: 1u64,
        block_number: 1u64,
        actionsState: hash,
        proof_calculations,
        blocks,
        admin: ctx.sender(),
        public_key,
        circuit,
        circuit_address,
        pool,
        version: DEX_VERSION,
        previous_block_timestamp: block_timestamp,
        previous_block_last_sequence: 0u64,
        previous_block_actions_state: hash,
        last_proved_block_number: 0u64,
        last_proved_sequence: 0u64,
        isPaused: false,
    };

    event::emit(DEXCreateEvent {
        address: dex.id.to_address(),
        admin: dex.admin,
        version: dex.version,
        actionsState: dex.actionsState,
        timestamp,
    });

    transfer::share_object(dex);
}

// Error codes
#[error]
const ENotAuthorized: vector<u8> = b"Not authorized";

public(package) fun only_admin(dex: &DEX, ctx: &TxContext) {
    assert!(dex.admin == ctx.sender(), ENotAuthorized);
}

#[error]
const EDEXPaused: vector<u8> = b"DEX is paused";

public(package) fun not_paused(dex: &DEX) {
    assert!(dex.isPaused == false, EDEXPaused);
}

public(package) fun insert_account_to_pool(
    dex: &mut DEX,
    publicKey: u256,
    account: UserTradingAccount,
) {
    pool::insert_account(&mut dex.pool, publicKey, account);
}

public fun is_account_exist(dex: &DEX, publicKey: u256): bool {
    pool::is_account_exist(&dex.pool, publicKey)
}

public(package) fun get_public_key(dex: &DEX): vector<u8> {
    dex.public_key
}

public(package) fun get_dex_state(
    dex: &DEX,
): (vector<u8>, u64, u64, vector<u8>, String, u256) {
    (
        dex.public_key,
        dex.sequence,
        dex.block_number,
        dex.actionsState,
        pool::get_name(&dex.pool),
        pool::get_public_key(&dex.pool),
    )
}

public(package) fun get_pool_account_mut(
    dex: &mut DEX,
    publicKey: u256,
): &mut UserTradingAccount {
    pool::get__mut_account(&mut dex.pool, publicKey)
}

public(package) fun update_actions_state(
    dex: &mut DEX,
    actionState: vector<u8>,
) {
    assert!(dex.isPaused == false, EDEXPaused);
    dex.actionsState = actionState;
    dex.sequence = dex.sequence + 1;
}

public(package) fun update_pool_last_price(dex: &mut DEX, last_price: u64) {
    pool::update_last_price(&mut dex.pool, last_price);
}

#[error]
const ENoTransactions: vector<u8> = b"No new transactions";

#[error]
const ETooShortTimeSinceLastBlock: vector<u8> =
    b"The minimum time between blocks is 30 seconds";

const MIN_TIME_BETWEEN_BLOCKS: u64 = 30_000;

public fun create_block(dex: &mut DEX, clock: &Clock, ctx: &mut TxContext) {
    assert!(
        (dex.previous_block_last_sequence + 1) != dex.sequence,
        ENoTransactions,
    );
    let current_time = clock.timestamp_ms();
    assert!(
        current_time - dex.previous_block_timestamp > MIN_TIME_BETWEEN_BLOCKS,
        ETooShortTimeSinceLastBlock,
    );
    let mut block_number = dex.block_number;
    let start_sequence = dex.previous_block_last_sequence + 1;
    let end_sequence = dex.sequence - 1;
    let proof_calculation = object_table::borrow_mut(
        &mut dex.proof_calculations,
        block_number,
    );
    let finished = prover::set_end_sequence(
        proof_calculation,
        end_sequence,
        clock,
        ctx,
    );
    if (finished) {
        if (dex.last_proved_block_number == block_number - 1) {
            dex.last_proved_block_number = block_number;
        };
    };

    let (timestamp, block) = create_block_internal(
        block_number,
        start_sequence,
        end_sequence,
        &dex.pool,
        dex.actionsState,
        dex.previous_block_actions_state,
        option::some(dex.previous_block_timestamp),
        clock,
        ctx,
    );
    object_table::add(
        &mut dex.blocks,
        block_number,
        block,
    );
    block_number = block_number + 1;
    let (new_proof_calculation, _) = prover::create_block_proof_calculation(
        block_number,
        dex.circuit_address,
        dex.sequence,
        option::none(),
        clock,
        ctx,
    );
    dex.block_number = block_number;
    dex.previous_block_timestamp = timestamp;
    dex.previous_block_actions_state = dex.actionsState;
    dex.previous_block_last_sequence = end_sequence;
    object_table::add(
        &mut dex.proof_calculations,
        block_number,
        new_proof_calculation,
    );
}

public fun start_proving(
    dex: &mut DEX,
    block_number: u64,
    sequences: vector<u64>, // should be sorted
    merged_sequences_1: Option<vector<u64>>,
    merged_sequences_2: Option<vector<u64>>,
    job_id: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let proof_calculation = object_table::borrow_mut(
        &mut dex.proof_calculations,
        block_number,
    );
    prover::start_proving(
        proof_calculation,
        sequences,
        merged_sequences_1,
        merged_sequences_2,
        job_id,
        clock,
        ctx,
    );
}

public fun submit_proof(
    dex: &mut DEX,
    block_number: u64,
    sequences: vector<u64>, // should be sorted
    merged_sequences_1: Option<vector<u64>>,
    merged_sequences_2: Option<vector<u64>>,
    job_id: String,
    da_hash: String,
    cpu_cores: u8,
    prover_architecture: String,
    prover_memory: u64,
    cpu_time: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let proof_calculation = object_table::borrow_mut(
        &mut dex.proof_calculations,
        block_number,
    );
    let finished = prover::submit_proof(
        proof_calculation,
        sequences,
        merged_sequences_1,
        merged_sequences_2,
        job_id,
        da_hash,
        cpu_cores,
        prover_architecture,
        prover_memory,
        cpu_time,
        clock,
        ctx,
    );
    if (finished) {
        let mut i = dex.last_proved_block_number + 1;
        while (i < dex.block_number) {
            let proof_calculation = object_table::borrow(
                &dex.proof_calculations,
                i,
            );
            if (prover::is_finished(proof_calculation)) {
                dex.last_proved_block_number = i;
                let end_sequence = prover::get_proof_calculation_end_sequence(
                    proof_calculation,
                );
                dex.last_proved_sequence = *end_sequence.borrow();
            } else return;
            i = i + 1;
        };
    };
}

public fun reject_proof(
    dex: &mut DEX,
    block_number: u64,
    sequences: vector<u64>, // should be sorted
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let proof_calculation = object_table::borrow_mut(
        &mut dex.proof_calculations,
        block_number,
    );
    prover::reject_proof(
        proof_calculation,
        sequences,
        clock,
        ctx,
    );
}

#[allow(lint(self_transfer))]
public(package) fun create_block_internal(
    block_number: u64,
    start_sequence: u64,
    end_sequence: u64,
    pool: &Pool,
    actions_state: vector<u8>,
    previous_block_actions_state: vector<u8>,
    previous_block_timestamp: Option<u64>,
    clock: &Clock,
    ctx: &mut TxContext,
): (u64, Block) {
    let timestamp = clock.timestamp_ms();
    let mut name: String = b"Silvana DEX Block ".to_string();
    name.append(block_number.to_string());
    let mut block_state_name: String = b"Silvana DEX Block ".to_string();
    block_state_name.append(block_number.to_string());
    block_state_name.append(b" State".to_string());
    let mut state = object_table::new<u256, UserTradingAccount>(ctx);
    let users = pool::get_users(pool);
    let number_of_users = users.size();
    let addresses = users.keys();
    let mut i = 0;
    while (i < number_of_users) {
        let account = pool::get_account(pool, addresses[i]);
        let copied_account = copy_user_trading_account(account, ctx);
        object_table::add(&mut state, addresses[i], copied_account);
        i = i + 1;
    };

    let block_state = BlockState {
        id: object::new(ctx),
        name: block_state_name,
        block_number: block_number,
        sequence: end_sequence,
        users: *addresses,
        state,
    };

    let time_since_last_block = if (previous_block_timestamp.is_some()) {
        timestamp - *previous_block_timestamp.borrow()
    } else {
        0u64
    };
    let block_id = object::new(ctx);

    let block = Block {
        id: block_id,
        name,
        block_number,
        start_sequence,
        end_sequence,
        block_state,
        time_since_last_block,
        number_of_transactions: end_sequence - start_sequence + 1,
        start_action_state: previous_block_actions_state,
        end_action_state: actions_state,
        state_data_availability: option::none(),
        proof_data_availability: option::none(),
        mina_tx_hash: option::none(),
        mina_tx_included_in_block: false,
        created_at: timestamp,
        state_calculated_at: option::none(),
        proved_at: option::none(),
        sent_to_mina_at: option::none(),
        settled_on_mina_at: option::none(),
    };

    event::emit(BlockEvent {
        address: block.id.to_address(),
        block_number,
        start_sequence,
        end_sequence,
        name,
        timestamp,
        time_since_last_block,
        number_of_transactions: end_sequence - start_sequence + 1,
        start_action_state: previous_block_actions_state,
        end_action_state: actions_state,
    });
    (timestamp, block)
}

public fun update_block_state_data_availability(
    dex: &mut DEX,
    block_number: u64,
    state_data_availability: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    only_admin(dex, ctx);
    let timestamp = clock.timestamp_ms();
    let block = object_table::borrow_mut(
        &mut dex.blocks,
        block_number,
    );
    block.state_data_availability = option::some(state_data_availability);
    block.state_calculated_at = option::some(timestamp);
    event::emit(DataAvailabilityEvent {
        block_number: block.block_number,
        state_data_availability: block.state_data_availability,
        proof_data_availability: block.proof_data_availability,
        state_calculated_at: timestamp,
        proof_calculated_at: option::none(),
    });
}

public fun update_block_proof_data_availability(
    dex: &mut DEX,
    block_number: u64,
    proof_data_availability: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    only_admin(dex, ctx);
    let timestamp = clock.timestamp_ms();
    let block = object_table::borrow_mut(
        &mut dex.blocks,
        block_number,
    );
    block.proof_data_availability = option::some(proof_data_availability);
    block.proved_at = option::some(timestamp);
    event::emit(DataAvailabilityEvent {
        block_number: block.block_number,
        state_data_availability: block.state_data_availability,
        proof_data_availability: block.proof_data_availability,
        state_calculated_at: *block.state_calculated_at.borrow(),
        proof_calculated_at: option::some(timestamp),
    });
}

#[error]
const EBlockNotProved: vector<u8> = b"Block not proved";

public fun update_block_mina_tx_hash(
    dex: &mut DEX,
    block_number: u64,
    mina_tx_hash: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    only_admin(dex, ctx);
    let timestamp = clock.timestamp_ms();
    let block = object_table::borrow_mut(
        &mut dex.blocks,
        block_number,
    );
    assert!(
        block.state_data_availability.is_some() && (block.proof_data_availability.is_some() || block_number == 0),
        EBlockNotProved,
    );
    block.mina_tx_hash = option::some(mina_tx_hash);
    block.sent_to_mina_at = option::some(timestamp);
    event::emit(MinaTransactionEvent {
        block_number: block.block_number,
        start_sequence: block.start_sequence,
        end_sequence: block.end_sequence,
        state_data_availability: *block.state_data_availability.borrow(),
        proof_data_availability: block.proof_data_availability,
        mina_tx_hash,
        mina_tx_included_in_block: false,
        sent_to_mina_at: timestamp,
        settled_on_mina_at: option::none(),
    });
}

#[error]
const EBlockNotSentToMina: vector<u8> = b"Block not sent to Mina";

public fun update_block_mina_tx_included_in_block(
    dex: &mut DEX,
    block_number: u64,
    settled_on_mina_at: u64,
    ctx: &mut TxContext,
) {
    only_admin(dex, ctx);
    let block = object_table::borrow_mut(
        &mut dex.blocks,
        block_number,
    );
    assert!(
        block.state_data_availability.is_some() && (block.proof_data_availability.is_some() || block_number == 0),
        EBlockNotProved,
    );
    assert!(block.sent_to_mina_at.is_some(), EBlockNotSentToMina);
    assert!(block.mina_tx_hash.is_some(), EBlockNotSentToMina);
    block.mina_tx_included_in_block = true;
    block.settled_on_mina_at = option::some(settled_on_mina_at);
    event::emit(MinaTransactionEvent {
        block_number: block.block_number,
        start_sequence: block.start_sequence,
        end_sequence: block.end_sequence,
        state_data_availability: *block.state_data_availability.borrow(),
        proof_data_availability: block.proof_data_availability,
        mina_tx_hash: *block.mina_tx_hash.borrow(),
        mina_tx_included_in_block: true,
        sent_to_mina_at: *block.sent_to_mina_at.borrow(),
        settled_on_mina_at: option::some(settled_on_mina_at),
    });
}

public(package) fun update_pool_bid(
    dex: &mut DEX,
    publicKey: u256,
    amount: u64,
    price: u64,
) {
    update_bids(&mut dex.pool, publicKey, amount, price);
}

public(package) fun update_pool_offer(
    dex: &mut DEX,
    publicKey: u256,
    amount: u64,
    price: u64,
) {
    update_offers(&mut dex.pool, publicKey, amount, price);
}
