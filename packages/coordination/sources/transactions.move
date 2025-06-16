module dex::transactions;

use dex::main::{
    DEX,
    not_paused,
    insert_account_to_pool,
    is_account_exist,
    update_actions_state,
    get_dex_state,
    get_pool_account_mut,
    update_pool_last_price,
    update_pool_bid,
    update_pool_offer
};
use dex::mina::{MinaSignature, create_mina_signature, create_mina_balance};
use dex::order::create_order;
use dex::user::{
    create_user,
    create_user_trading_account,
    get_account_data,
    increment_nonce,
    update_base_balance,
    update_quote_balance,
    update_bid,
    update_ask,
    get_bid,
    get_ask
};
use std::string::String;
use sui::ed25519::ed25519_verify;
use sui::event;
use sui::hash::blake2b256;

const OPERATION_CREATE_ACCOUNT: u8 = 1;
const OPERATION_BID: u8 = 2;
const OPERATION_ASK: u8 = 3;
const OPERATION_TRADE: u8 = 4;
const OPERATION_TRANSFER: u8 = 5;
// const OPERATION_WITHDRAW: u8 = 6;
// const OPERATION_DEPOSIT: u8 = 7;
// const OPERATION_STAKE: u8 = 8;
// const OPERATION_UNSTAKE: u8 = 9;

// Error codes
#[error]
const EInvalidAsk: vector<u8> = b"Invalid ask";
#[error]
const EInvalidBid: vector<u8> = b"Invalid bid";
#[error]
const EInsufficientAsk: vector<u8> = b"Insufficient ask";
#[error]
const EInsufficientBid: vector<u8> = b"Insufficient bid";
#[error]
const EInvalidAskPrice: vector<u8> = b"Invalid ask price";
#[error]
const EInvalidBidPrice: vector<u8> = b"Invalid bid price";
#[error]
const ECannotTransferBorrowedAmount: vector<u8> =
    b"Cannot transfer borrowed amount";
#[error]
const EInsufficientSenderBalance: vector<u8> = b"Insufficient sender balance";
#[error]
const EInvalidSignature: vector<u8> = b"Invalid signature";
#[error]
const EInvalidPublicKey: vector<u8> = b"Invalid public key";
#[error]
const EInsufficientBalance: vector<u8> = b"Insufficient balance";
#[error]
const EInvalidAmount: vector<u8> = b"Invalid amount";
#[error]
const EInvalidPrice: vector<u8> = b"Invalid price";

public struct OperationDataInput has copy, drop {
    pool: String,
    poolPublicKey: u256,
    actionsState: vector<u8>,
    block_number: u64,
    sequence: u64,
    operation: u8,
    accountPublicKey: u256,
    nonce: u64,
    baseTokenAmount: Option<u64>,
    quoteTokenAmount: Option<u64>,
    price: Option<u64>,
    receiverPublicKey: Option<u256>,
    receiverNonce: Option<u64>,
}

public struct OperationData has copy, drop {
    operation: u8,
    pool: String,
    poolPublicKey: u256,
    data: vector<u8>,
    newActionsState: vector<u8>,
    actionsState: vector<u8>,
    block_number: u64,
    sequence: u64,
}

public struct Operation has copy, drop {
    operation: u8,
    sequence: u64,
    block_number: u64,
    pool: String,
    poolPublicKey: u256,
    actionState: vector<u8>,
    data: vector<u8>,
}

public struct ActionCreateAccount has copy, drop {
    address: address,
    publicKey: u256,
    publicKeyBase58: String,
    name: String,
    role: String,
    image: String,
    baseBalance: u64,
    quoteBalance: u64,
}

public struct ActionBid has copy, drop {
    userPublicKey: u256,
    poolPublicKey: u256,
    baseTokenAmount: u64,
    price: u64,
    isSome: bool,
    nonce: u64,
    userSignature: MinaSignature,
}

public struct ActionAsk has copy, drop {
    userPublicKey: u256,
    poolPublicKey: u256,
    baseTokenAmount: u64,
    price: u64,
    isSome: bool,
    nonce: u64,
    userSignature: MinaSignature,
}

public struct ActionTrade has copy, drop {
    buyerPublicKey: u256,
    sellerPublicKey: u256,
    poolPublicKey: u256,
    baseTokenAmount: u64,
    quoteTokenAmount: u64,
    price: u64,
    buyerNonce: u64,
    sellerNonce: u64,
}

public struct ActionTransfer has copy, drop {
    senderPublicKey: u256,
    senderSignature: MinaSignature,
    senderNonce: u64,
    receiverPublicKey: u256,
    baseTokenAmount: u64,
    quoteTokenAmount: u64,
}

public struct OperationCreateAccountEvent has copy, drop {
    operation: Operation,
    details: ActionCreateAccount,
}

public struct OperationBidEvent has copy, drop {
    operation: Operation,
    details: ActionBid,
}

public struct OperationAskEvent has copy, drop {
    operation: Operation,
    details: ActionAsk,
}

public struct OperationTradeEvent has copy, drop {
    operation: Operation,
    details: ActionTrade,
}

public struct OperationTransferEvent has copy, drop {
    operation: Operation,
    details: ActionTransfer,
}

#[error]
const EAccountAlreadyExists: vector<u8> = b"Account already exists";

public fun create_account(
    dex: &mut DEX,
    publicKey: u256,
    publicKeyBase58: String,
    role: String,
    image: String,
    name: String,
    baseBalance: u64,
    quoteBalance: u64,
    ctx: &mut TxContext,
): address {
    dex.not_paused();
    assert!(is_account_exist(dex, publicKey) == false, EAccountAlreadyExists);
    if (baseBalance > 0 || quoteBalance > 0) {
        dex.only_admin(ctx);
    };
    let user_address = create_user(
        publicKey,
        publicKeyBase58,
        name,
        role,
        image,
        ctx,
    );

    let account = create_user_trading_account(baseBalance, quoteBalance, ctx);
    insert_account_to_pool(dex, publicKey, account);
    let operation = OPERATION_CREATE_ACCOUNT;

    let (
        _,
        sequence,
        block_number,
        actions_state,
        pool_name,
        pool_public_key,
    ) = get_dex_state(dex);

    let operationData = create_operation_data(OperationDataInput {
        pool: pool_name,
        poolPublicKey: pool_public_key,
        actionsState: actions_state,
        block_number: block_number,
        sequence: sequence,
        operation: operation,
        accountPublicKey: publicKey,
        nonce: 0,
        baseTokenAmount: option::some(baseBalance),
        quoteTokenAmount: option::some(quoteBalance),
        price: option::none(),
        receiverPublicKey: option::none(),
        receiverNonce: option::none(),
    });

    let operation = create_operation(&operationData);

    dex.update_actions_state(operation.actionState);

    event::emit(OperationCreateAccountEvent {
        operation,
        details: ActionCreateAccount {
            address: user_address,
            publicKey,
            publicKeyBase58,
            name,
            role,
            image,
            baseBalance,
            quoteBalance,
        },
    });

    user_address
}

public fun bid(
    dex: &mut DEX,
    publicKey: u256,
    baseTokenAmount: u64,
    price: u64,
    userSignature_r: u256,
    userSignature_s: u256,
    validatorSignature: vector<u8>,
) {
    dex.not_paused();

    assert!(price > 0 || baseTokenAmount == 0, EInvalidPrice);
    let quoteAmount =
        (
            (baseTokenAmount as u128) * (price as u128) / 1_000_000_000u128,
        ) as u64;
    let userSignature = create_mina_signature(userSignature_r, userSignature_s);
    let (
        dex_public_key,
        sequence,
        block_number,
        actions_state,
        pool_name,
        pool_public_key,
    ) = get_dex_state(
        dex,
    );

    let operation = OPERATION_BID;
    let nonce;
    {
        let account = get_pool_account_mut(dex, publicKey);
        let (_, quote_balance, sender_nonce) = get_account_data(account);
        assert!(quote_balance >= quoteAmount, EInsufficientBalance);
        update_bid(
            account,
            create_order(baseTokenAmount, price),
        );

        account.increment_nonce();
        nonce = sender_nonce;
    };
    update_pool_bid(dex, publicKey, baseTokenAmount, price);

    let operationData = create_operation_data(OperationDataInput {
        pool: pool_name,
        poolPublicKey: pool_public_key,
        actionsState: actions_state,
        block_number: block_number,
        sequence: sequence,
        operation,
        accountPublicKey: publicKey,
        nonce,
        baseTokenAmount: option::some(baseTokenAmount),
        quoteTokenAmount: option::none(),
        price: option::some(price),
        receiverPublicKey: option::none(),
        receiverNonce: option::none(),
    });

    let valid = verify_signature(
        dex_public_key,
        validatorSignature,
        userSignature,
        &operationData,
    );
    assert!(valid, EInvalidSignature);

    let operation = create_operation(&operationData);
    dex.update_actions_state(operation.actionState);

    event::emit(OperationBidEvent {
        operation,
        details: ActionBid {
            userPublicKey: publicKey,
            poolPublicKey: pool_public_key,
            baseTokenAmount,
            price,
            userSignature,
            isSome: baseTokenAmount != 0 && price != 0,
            nonce,
        },
    });
}

public fun ask(
    dex: &mut DEX,
    publicKey: u256,
    baseTokenAmount: u64,
    price: u64,
    userSignature_r: u256,
    userSignature_s: u256,
    validatorSignature: vector<u8>,
) {
    not_paused(dex);
    assert!(price > 0 || baseTokenAmount == 0, EInvalidPrice);
    let userSignature = create_mina_signature(userSignature_r, userSignature_s);

    let operation = OPERATION_ASK;

    let (
        dex_public_key,
        sequence,
        block_number,
        actions_state,
        pool_name,
        pool_public_key,
    ) = get_dex_state(dex);

    let nonce;
    {
        let account = get_pool_account_mut(dex, publicKey);
        let (base_balance, _, sender_nonce) = get_account_data(account);
        assert!(base_balance >= baseTokenAmount, EInsufficientBalance);
        account.update_ask(
            create_order(baseTokenAmount, price),
        );
        account.increment_nonce();
        nonce = sender_nonce;
    };
    update_pool_offer(dex, publicKey, baseTokenAmount, price);

    let operationData = create_operation_data(OperationDataInput {
        pool: pool_name,
        poolPublicKey: pool_public_key,
        actionsState: actions_state,
        block_number: block_number,
        sequence: sequence,
        operation,
        accountPublicKey: publicKey,
        nonce,
        baseTokenAmount: option::some(baseTokenAmount),
        quoteTokenAmount: option::none(),
        price: option::some(price),
        receiverPublicKey: option::none(),
        receiverNonce: option::none(),
    });
    let valid = verify_signature(
        dex_public_key,
        validatorSignature,
        userSignature,
        &operationData,
    );
    assert!(valid, EInvalidSignature);

    let operation = create_operation(&operationData);
    dex.update_actions_state(operation.actionState);

    event::emit(OperationAskEvent {
        operation,
        details: ActionAsk {
            userPublicKey: publicKey,
            poolPublicKey: pool_public_key,
            baseTokenAmount,
            price,
            isSome: baseTokenAmount != 0 && price != 0,
            nonce,
            userSignature,
        },
    });
}

public fun trade(
    dex: &mut DEX,
    buyerPublicKey: u256,
    sellerPublicKey: u256,
    baseTokenAmount: u64,
    quoteTokenAmount: u64,
) {
    not_paused(dex);
    assert!(baseTokenAmount > 0, EInvalidAmount);
    assert!(quoteTokenAmount > 0, EInvalidAmount);

    let buyerNonce;
    {
        let buyerAccount = get_pool_account_mut(dex, buyerPublicKey);
        let (base_balance, quote_balance, nonce) = get_account_data(
            buyerAccount,
        );
        let (bid_amount, bid_price, bid_is_some) = buyerAccount.get_bid();
        assert!(bid_is_some, EInvalidBid);
        assert!(bid_amount >= baseTokenAmount, EInsufficientBid);
        assert!(
            (bid_price as u128) * (baseTokenAmount as u128)  >= (quoteTokenAmount as u128) * 1_000_000_000u128,
            EInvalidBidPrice,
        );
        assert!(quote_balance >= quoteTokenAmount, EInsufficientBalance);
        let new_bid_amount = bid_amount - baseTokenAmount;
        let new_base_balance = base_balance + baseTokenAmount;
        let new_quote_balance = quote_balance - quoteTokenAmount;
        buyerAccount.update_bid(
            create_order(new_bid_amount, bid_price),
        );
        buyerAccount.update_base_balance(
            create_mina_balance(new_base_balance, 0, 0),
        );
        buyerAccount.update_quote_balance(
            create_mina_balance(new_quote_balance, 0, 0),
        );
        buyerNonce = nonce;
        update_pool_bid(dex, buyerPublicKey, new_bid_amount, bid_price);
    };

    let sellerNonce;
    {
        let sellerAccount = get_pool_account_mut(dex, sellerPublicKey);
        let (base_balance, quote_balance, nonce) = get_account_data(
            sellerAccount,
        );
        let (ask_amount, ask_price, ask_is_some) = sellerAccount.get_ask();
        assert!(ask_is_some, EInvalidAsk);
        assert!(ask_amount >= baseTokenAmount, EInsufficientAsk);
        assert!(
            (ask_price as u128) * (baseTokenAmount as u128)  <= (quoteTokenAmount as u128) * 1_000_000_000u128,
            EInvalidAskPrice,
        );
        assert!(base_balance >= baseTokenAmount, EInsufficientBalance);
        let new_ask_amount = ask_amount - baseTokenAmount;
        sellerAccount.update_ask(
            create_order(new_ask_amount, ask_price),
        );
        sellerAccount.update_base_balance(
            create_mina_balance(base_balance - baseTokenAmount, 0, 0),
        );
        sellerAccount.update_quote_balance(
            create_mina_balance(quote_balance + quoteTokenAmount, 0, 0),
        );
        sellerNonce = nonce;
        update_pool_offer(dex, sellerPublicKey, new_ask_amount, ask_price);
    };

    let operation = OPERATION_TRADE;

    let (
        _,
        sequence,
        block_number,
        actions_state,
        pool_name,
        pool_public_key,
    ) = get_dex_state(dex);

    let operationData = create_operation_data(OperationDataInput {
        pool: pool_name,
        poolPublicKey: pool_public_key,
        actionsState: actions_state,
        block_number: block_number,
        sequence: sequence,
        operation,
        accountPublicKey: sellerPublicKey,
        nonce: sellerNonce,
        baseTokenAmount: option::some(baseTokenAmount),
        quoteTokenAmount: option::some(quoteTokenAmount),
        price: option::none(),
        receiverPublicKey: option::some(buyerPublicKey),
        receiverNonce: option::some(buyerNonce),
    });
    let operation = create_operation(&operationData);
    dex.update_actions_state(operation.actionState);
    let price = (
        (quoteTokenAmount as u128) * 1_000_000_000u128 / (baseTokenAmount as u128) as u64,
    );
    dex.update_pool_last_price(price);
    event::emit(OperationTradeEvent {
        operation,
        details: ActionTrade {
            buyerPublicKey,
            sellerPublicKey,
            poolPublicKey: pool_public_key,
            baseTokenAmount,
            quoteTokenAmount,
            price,
            buyerNonce,
            sellerNonce,
        },
    });
}

public fun transfer(
    dex: &mut DEX,
    senderPublicKey: u256,
    receiverPublicKey: u256,
    baseTokenAmount: u64,
    quoteTokenAmount: u64,
    senderSignature_r: u256,
    senderSignature_s: u256,
    validatorSignature: vector<u8>,
) {
    not_paused(dex);
    assert!(baseTokenAmount > 0 || quoteTokenAmount > 0, EInvalidAmount);
    let operation = OPERATION_TRANSFER;
    let senderSignature = create_mina_signature(
        senderSignature_r,
        senderSignature_s,
    );
    let senderNonce;
    {
        let senderAccount = get_pool_account_mut(dex, senderPublicKey);
        let (base_balance, quote_balance, nonce) = get_account_data(
            senderAccount,
        );
        assert!(base_balance >= baseTokenAmount, EInsufficientSenderBalance);
        assert!(quote_balance >= quoteTokenAmount, EInsufficientSenderBalance);
        assert!(senderAccount.can_transfer(), ECannotTransferBorrowedAmount);

        senderAccount.update_base_balance(
            create_mina_balance(base_balance - baseTokenAmount, 0, 0),
        );
        senderAccount.update_quote_balance(
            create_mina_balance(quote_balance - quoteTokenAmount, 0, 0),
        );
        senderNonce = nonce;
        senderAccount.increment_nonce();
    };

    {
        let receiverAccount = get_pool_account_mut(dex, receiverPublicKey);
        let (base_balance, quote_balance, _) = get_account_data(
            receiverAccount,
        );
        receiverAccount.update_base_balance(
            create_mina_balance(base_balance + baseTokenAmount, 0, 0),
        );
        receiverAccount.update_quote_balance(
            create_mina_balance(quote_balance + quoteTokenAmount, 0, 0),
        );
    };

    let (
        dex_public_key,
        sequence,
        block_number,
        actions_state,
        pool_name,
        pool_public_key,
    ) = get_dex_state(dex);

    let operationData = create_operation_data(OperationDataInput {
        pool: pool_name,
        poolPublicKey: pool_public_key,
        actionsState: actions_state,
        block_number: block_number,
        sequence: sequence,
        operation,
        accountPublicKey: senderPublicKey,
        nonce: senderNonce,
        baseTokenAmount: option::some(baseTokenAmount),
        quoteTokenAmount: option::some(quoteTokenAmount),
        price: option::none(),
        receiverPublicKey: option::some(receiverPublicKey),
        receiverNonce: option::none(),
    });

    let valid = verify_signature(
        dex_public_key,
        validatorSignature,
        senderSignature,
        &operationData,
    );
    assert!(valid, EInvalidSignature);
    let operation = create_operation(&operationData);
    dex.update_actions_state(operation.actionState);
    event::emit(OperationTransferEvent {
        operation,
        details: ActionTransfer {
            senderPublicKey,
            receiverPublicKey,
            baseTokenAmount,
            quoteTokenAmount,
            senderNonce,
            senderSignature,
        },
    });
}

const DEX_SIGNATURE_CONTEXT: u256 = 7738487874684489969637964886483;

#[allow(implicit_const_copy)]
public fun verify_signature(
    dex_public_key: vector<u8>,
    signature: vector<u8>,
    minaSignature: MinaSignature,
    operationData: &OperationData,
): bool {
    assert!(vector::length(&dex_public_key) == 32, EInvalidPublicKey);
    assert!(vector::length(&signature) == 64, EInvalidSignature);
    let mut msg = vector::empty<u8>();
    vector::append(&mut msg, std::bcs::to_bytes(&DEX_SIGNATURE_CONTEXT));
    vector::append(&mut msg, minaSignature.to_bytes());
    vector::append(&mut msg, operationData.data);
    let valid = ed25519_verify(&signature, &dex_public_key, &msg);
    assert!(valid, EInvalidSignature);
    valid
}

#[allow(implicit_const_copy)]
fun create_operation_data(data: OperationDataInput): OperationData {
    let mut msg = vector::empty<u8>();
    vector::append(&mut msg, std::bcs::to_bytes(&data.poolPublicKey));
    vector::append(&mut msg, std::bcs::to_bytes(&data.operation));
    vector::append(&mut msg, std::bcs::to_bytes(&data.accountPublicKey));
    vector::append(&mut msg, std::bcs::to_bytes(&data.nonce));

    if (data.baseTokenAmount.is_some()) {
        vector::append(
            &mut msg,
            std::bcs::to_bytes(data.baseTokenAmount.borrow()),
        );
    };
    if (data.quoteTokenAmount.is_some()) {
        vector::append(
            &mut msg,
            std::bcs::to_bytes(data.quoteTokenAmount.borrow()),
        );
    };
    if (data.price.is_some()) {
        vector::append(&mut msg, std::bcs::to_bytes(data.price.borrow()));
    };
    if (data.receiverPublicKey.is_some()) {
        vector::append(
            &mut msg,
            std::bcs::to_bytes(data.receiverPublicKey.borrow()),
        );
    };
    if (data.receiverNonce.is_some()) {
        vector::append(
            &mut msg,
            std::bcs::to_bytes(data.receiverNonce.borrow()),
        );
    };
    let mut actionsStateData = vector::empty<u8>();
    vector::append(&mut actionsStateData, data.actionsState);
    vector::append(&mut actionsStateData, msg);
    let hash = blake2b256(&actionsStateData);
    OperationData {
        operation: data.operation,
        pool: data.pool,
        poolPublicKey: data.poolPublicKey,
        data: msg,
        newActionsState: hash,
        actionsState: data.actionsState,
        block_number: data.block_number,
        sequence: data.sequence,
    }
}

public(package) fun create_operation(operationData: &OperationData): Operation {
    Operation {
        operation: operationData.operation,
        sequence: operationData.sequence,
        block_number: operationData.block_number,
        actionState: operationData.newActionsState,
        data: operationData.data,
        pool: operationData.pool,
        poolPublicKey: operationData.poolPublicKey,
    }
}
