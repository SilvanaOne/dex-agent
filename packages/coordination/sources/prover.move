module dex::prover;

use std::string::String;
use sui::clock::Clock;
use sui::display;
use sui::event;
use sui::package;
use sui::vec_map::{VecMap, contains, insert, get_mut, empty};

#[allow(unused_field)]
public struct Circuit has key, store {
    id: UID,
    name: String,
    description: String,
    package_da_hash: String,
    verification_key_hash: u256,
    verification_key_data: String,
    created_at: u64,
}

const PROOF_STATUS_STARTED: u8 = 1;
const PROOF_STATUS_CALCULATED: u8 = 2;
const PROOF_STATUS_REJECTED: u8 = 3;
const PROOF_STATUS_RESERVED: u8 = 4;
const PROOF_STATUS_USED: u8 = 5;

public struct Proof has copy, drop, store {
    status: u8,
    da_hash: Option<String>,
    sequence1: Option<vector<u64>>,
    sequence2: Option<vector<u64>>,
    rejected_count: u16,
    timestamp: u64,
    prover: address,
    user: Option<address>,
    job_id: String,
}

public struct ProofStartedEvent has copy, drop {
    block_number: u64,
    sequences: vector<u64>,
    timestamp: u64,
    prover: address,
}

public struct ProofSubmittedEvent has copy, drop {
    block_number: u64,
    sequences: vector<u64>,
    da_hash: String,
    timestamp: u64,
    prover: address,
    cpu_time: u64,
    cpu_cores: u8,
    prover_memory: u64,
    prover_architecture: String,
}

public struct ProofUsedEvent has copy, drop {
    block_number: u64,
    sequences: vector<u64>,
    da_hash: String,
    timestamp: u64,
    user: address,
}

public struct ProofReservedEvent has copy, drop {
    block_number: u64,
    sequences: vector<u64>,
    da_hash: String,
    timestamp: u64,
    user: address,
}

public struct ProofReturnedEvent has copy, drop {
    block_number: u64,
    sequences: vector<u64>,
    timestamp: u64,
}

public struct ProofRejectedEvent has copy, drop {
    block_number: u64,
    sequences: vector<u64>,
    timestamp: u64,
    verifier: address,
}

public struct BlockProofEvent has copy, drop {
    block_number: u64,
    start_sequence: u64,
    end_sequence: u64,
    da_hash: String,
    timestamp: u64,
}

public struct ProofCalculation has key, store {
    id: UID,
    block_number: u64,
    start_sequence: u64,
    end_sequence: Option<u64>,
    proofs: VecMap<vector<u64>, Proof>,
    circuit: address,
    block_proof: Option<String>,
    is_finished: bool,
}

public struct ProofCalculationCreatedEvent has copy, drop {
    block_number: u64,
    start_sequence: u64,
    end_sequence: Option<u64>,
    circuit: address,
    timestamp: u64,
}

public struct PROVER has drop {}

fun init(otw: PROVER, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let keys = vector[
        b"name".to_string(),
        b"description".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let values = vector[
        b"Block {block_number} proofs".to_string(),
        b"Silvana DEX Proofs for block {block_number}".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"DFST".to_string(),
    ];
    let mut display_prover = display::new_with_fields<ProofCalculation>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display_prover.update_version();
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display_prover, ctx.sender());
}

public(package) fun create_circuit(
    name: String,
    description: String,
    package_da_hash: String,
    verification_key_hash: u256,
    verification_key_data: String,
    clock: &Clock,
    ctx: &mut TxContext,
): (Circuit, address) {
    let id = object::new(ctx);
    let timestamp = sui::clock::timestamp_ms(clock);
    let address = id.to_address();
    let circuit = Circuit {
        id,
        name,
        description,
        package_da_hash,
        verification_key_hash,
        verification_key_data,
        created_at: timestamp,
    };
    (circuit, address)
}

public(package) fun create_block_proof_calculation(
    block_number: u64,
    circuit: address,
    start_sequence: u64,
    end_sequence: Option<u64>,
    clock: &Clock,
    ctx: &mut TxContext,
): (ProofCalculation, address) {
    let proofs = empty<vector<u64>, Proof>();
    let id = object::new(ctx);
    let address = id.to_address();
    let timestamp = sui::clock::timestamp_ms(clock);
    let proof_calculation = ProofCalculation {
        id,
        block_number,
        start_sequence,
        end_sequence,
        proofs,
        block_proof: option::none(),
        is_finished: block_number == 0,
        circuit,
    };
    event::emit(ProofCalculationCreatedEvent {
        block_number,
        start_sequence,
        end_sequence,
        circuit,
        timestamp,
    });
    (proof_calculation, address)
}

public(package) fun finish_proof_calculation(
    proof_calculation: &mut ProofCalculation,
    end_sequence: u64,
    block_proof: String,
    clock: &Clock,
) {
    proof_calculation.block_proof = option::some(block_proof);
    proof_calculation.end_sequence = option::some(end_sequence);
    proof_calculation.is_finished = true;
    event::emit(BlockProofEvent {
        block_number: proof_calculation.block_number,
        start_sequence: proof_calculation.start_sequence,
        end_sequence,
        da_hash: block_proof,
        timestamp: sui::clock::timestamp_ms(clock),
    });
}

public(package) fun set_end_sequence(
    proof_calculation: &mut ProofCalculation,
    end_sequence: u64,
    clock: &Clock,
    ctx: &TxContext,
): bool {
    proof_calculation.end_sequence = option::some(end_sequence);
    let mut i = proof_calculation.start_sequence;
    let mut sequences = vector::empty<u64>();
    while (i <= end_sequence) {
        vector::push_back(&mut sequences, i);
        i = i + 1;
    };
    if (contains(&proof_calculation.proofs, &sequences)) {
        let mut da_hash = option::none<String>();
        {
            let proof = get_mut(&mut proof_calculation.proofs, &sequences);
            if (
                proof.status == PROOF_STATUS_CALCULATED && proof.da_hash.is_some()
            ) {
                proof.status = PROOF_STATUS_USED;
                proof.timestamp = sui::clock::timestamp_ms(clock);
                proof.user = option::some(ctx.sender());
                da_hash = option::some(*proof.da_hash.borrow());
            };
        };
        {
            if (da_hash.is_some()) {
                finish_proof_calculation(
                    proof_calculation,
                    end_sequence,
                    *da_hash.borrow(),
                    clock,
                );
                return true
            }
        };
    };
    false
}

public fun get_proof_calculation_address(
    proof_calculation: &ProofCalculation,
): address {
    proof_calculation.id.to_address()
}

public fun get_proof_calculation_end_sequence(
    proof_calculation: &ProofCalculation,
): Option<u64> {
    proof_calculation.end_sequence
}

public fun is_finished(proof_calculation: &ProofCalculation): bool {
    proof_calculation.is_finished
}

#[error]
const EProofNotCalculated: vector<u8> = b"Proof not calculated or already used";

fun use_proof(proof: &mut Proof, clock: &Clock, ctx: &TxContext) {
    assert!(
        proof.status != PROOF_STATUS_REJECTED && proof.status != PROOF_STATUS_STARTED,
        EProofNotCalculated,
    );
    proof.status = PROOF_STATUS_USED;
    proof.timestamp = sui::clock::timestamp_ms(clock);
    proof.user = option::some(ctx.sender());
}

fun return_proof(proof: &mut Proof, clock: &Clock) {
    proof.status = PROOF_STATUS_CALCULATED;
    proof.timestamp = sui::clock::timestamp_ms(clock);
    proof.user = option::none();
}

fun reserve_proof(
    proof: &mut Proof,
    isBlockProof: bool,
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(
        proof.status == PROOF_STATUS_CALCULATED || (isBlockProof && (proof.status == PROOF_STATUS_USED || proof.status == PROOF_STATUS_RESERVED)),
        EProofNotCalculated,
    );

    proof.status = PROOF_STATUS_RESERVED;
    proof.timestamp = sui::clock::timestamp_ms(clock);
    proof.user = option::some(ctx.sender());
}

#[error]
const EProofAlreadyStarted: vector<u8> = b"Proof already started";

public(package) fun start_proving(
    proof_calculation: &mut ProofCalculation,
    sequences: vector<u64>,
    sequence1: Option<vector<u64>>,
    sequence2: Option<vector<u64>>,
    job_id: String,
    clock: &Clock,
    ctx: &TxContext,
) {
    let mut isBlockProof = false;
    if (proof_calculation.end_sequence.is_some()) {
        let end_sequence = *proof_calculation.end_sequence.borrow();
        if (
            sequences[0] == proof_calculation.start_sequence && sequences[vector::length(&sequences)-1] == end_sequence
        ) {
            isBlockProof = true;
        }
    };
    let proof = Proof {
        sequence1,
        sequence2,
        rejected_count: 0,
        job_id,
        prover: ctx.sender(),
        user: option::none(),
        da_hash: option::none(),
        status: PROOF_STATUS_STARTED,
        timestamp: sui::clock::timestamp_ms(clock),
    };
    if (contains(&proof_calculation.proofs, &sequences)) {
        let mut existing_sequence_1: vector<u64> = vector::empty();
        let mut existing_sequence_2: vector<u64> = vector::empty();
        {
            let existing_proof = get_mut(
                &mut proof_calculation.proofs,
                &sequences,
            );
            assert!(
                existing_proof.status == PROOF_STATUS_REJECTED,
                EProofAlreadyStarted,
            );
            let rejected_count = existing_proof.rejected_count;
            if (existing_proof.sequence1.is_some()) {
                existing_sequence_1 = *existing_proof.sequence1.borrow();
            };
            if (existing_proof.sequence2.is_some()) {
                existing_sequence_2 = *existing_proof.sequence2.borrow();
            };
            *existing_proof = proof;
            existing_proof.rejected_count = rejected_count;
        };
        {
            if (existing_sequence_1.length() > 0) {
                if (contains(&proof_calculation.proofs, &existing_sequence_1)) {
                    let proof1 = get_mut(
                        &mut proof_calculation.proofs,
                        &existing_sequence_1,
                    );
                    return_proof(proof1, clock);
                    event::emit(ProofReturnedEvent {
                        block_number: proof_calculation.block_number,
                        sequences: existing_sequence_1,
                        timestamp: sui::clock::timestamp_ms(clock),
                    });
                }
            };
            if (existing_sequence_2.length() > 0) {
                if (contains(&proof_calculation.proofs, &existing_sequence_2)) {
                    let proof2 = get_mut(
                        &mut proof_calculation.proofs,
                        &existing_sequence_2,
                    );
                    return_proof(proof2, clock);
                    event::emit(ProofReturnedEvent {
                        block_number: proof_calculation.block_number,
                        sequences: existing_sequence_2,
                        timestamp: sui::clock::timestamp_ms(clock),
                    });
                };
            }
        };
    } else { insert(&mut proof_calculation.proofs, sequences, proof); };
    if (sequence1.is_some()) {
        let proof1 = get_mut(
            &mut proof_calculation.proofs,
            sequence1.borrow(),
        );
        reserve_proof(proof1, isBlockProof, clock, ctx);
        event::emit(ProofReservedEvent {
            block_number: proof_calculation.block_number,
            sequences: *sequence1.borrow(),
            da_hash: *proof1.da_hash.borrow(),
            timestamp: sui::clock::timestamp_ms(clock),
            user: ctx.sender(),
        });
    };
    if (sequence2.is_some()) {
        let proof2 = get_mut(
            &mut proof_calculation.proofs,
            sequence2.borrow(),
        );
        reserve_proof(proof2, isBlockProof, clock, ctx);
        event::emit(ProofReservedEvent {
            block_number: proof_calculation.block_number,
            sequences: *sequence2.borrow(),
            da_hash: *proof2.da_hash.borrow(),
            timestamp: sui::clock::timestamp_ms(clock),
            user: ctx.sender(),
        });
    };
    event::emit(ProofStartedEvent {
        block_number: proof_calculation.block_number,
        sequences,
        timestamp: sui::clock::timestamp_ms(clock),
        prover: ctx.sender(),
    })
}

public fun reject_proof(
    proof_calculation: &mut ProofCalculation,
    sequences: vector<u64>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let mut sequence1 = vector::empty<u64>();
    let mut sequence2 = vector::empty<u64>();
    {
        let proof = get_mut(&mut proof_calculation.proofs, &sequences);
        proof.status = PROOF_STATUS_REJECTED;
        proof.rejected_count = proof.rejected_count + 1;
        if (proof.sequence1.is_some()) {
            sequence1 = *proof.sequence1.borrow();
        };
        if (proof.sequence2.is_some()) {
            sequence2 = *proof.sequence2.borrow();
        };
    };
    if (sequence1.length() > 0) {
        let proof1 = get_mut(
            &mut proof_calculation.proofs,
            &sequence1,
        );
        return_proof(proof1, clock);
        event::emit(ProofReturnedEvent {
            block_number: proof_calculation.block_number,
            sequences: sequence1,
            timestamp: sui::clock::timestamp_ms(clock),
        });
    };
    if (sequence2.length() > 0) {
        let proof2 = get_mut(
            &mut proof_calculation.proofs,
            &sequence2,
        );
        return_proof(proof2, clock);
        event::emit(ProofReturnedEvent {
            block_number: proof_calculation.block_number,
            sequences: sequence2,
            timestamp: sui::clock::timestamp_ms(clock),
        });
    };
    event::emit(ProofRejectedEvent {
        block_number: proof_calculation.block_number,
        sequences,
        timestamp: sui::clock::timestamp_ms(clock),
        verifier: ctx.sender(),
    });
}

// TODO: add prover whitelisting or proof verification
public fun submit_proof(
    proof_calculation: &mut ProofCalculation,
    sequences: vector<u64>, // should be sorted
    sequence1: Option<vector<u64>>,
    sequence2: Option<vector<u64>>,
    job_id: String,
    da_hash: String,
    cpu_cores: u8,
    prover_architecture: String,
    prover_memory: u64,
    cpu_time: u64,
    clock: &Clock,
    ctx: &mut TxContext,
): bool {
    let proof = Proof {
        sequence1,
        sequence2,
        rejected_count: 0,
        job_id,
        prover: ctx.sender(),
        user: option::none(),
        da_hash: option::some(da_hash),
        status: PROOF_STATUS_CALCULATED,
        timestamp: sui::clock::timestamp_ms(clock),
    };
    event::emit(ProofSubmittedEvent {
        block_number: proof_calculation.block_number,
        sequences,
        da_hash,
        timestamp: sui::clock::timestamp_ms(clock),
        prover: ctx.sender(),
        cpu_cores,
        prover_architecture,
        prover_memory,
        cpu_time,
    });
    if (contains(&proof_calculation.proofs, &sequences)) {
        let existing_proof = get_mut(&mut proof_calculation.proofs, &sequences);
        let rejected_count = existing_proof.rejected_count;
        *existing_proof = proof;
        existing_proof.rejected_count = rejected_count;
    } else { insert(&mut proof_calculation.proofs, sequences, proof); };
    if (sequence1.is_some()) {
        let proof1 = get_mut(
            &mut proof_calculation.proofs,
            sequence1.borrow(),
        );
        use_proof(proof1, clock, ctx);
        event::emit(ProofUsedEvent {
            block_number: proof_calculation.block_number,
            sequences: *sequence1.borrow(),
            da_hash: *proof1.da_hash.borrow(),
            timestamp: sui::clock::timestamp_ms(clock),
            user: ctx.sender(),
        });
    };
    if (sequence2.is_some()) {
        let proof2 = get_mut(
            &mut proof_calculation.proofs,
            sequence2.borrow(),
        );
        use_proof(proof2, clock, ctx);
        event::emit(ProofUsedEvent {
            block_number: proof_calculation.block_number,
            sequences: *sequence2.borrow(),
            da_hash: *proof2.da_hash.borrow(),
            timestamp: sui::clock::timestamp_ms(clock),
            user: ctx.sender(),
        });
    };
    if (proof_calculation.end_sequence.is_some()) {
        let end_sequence = *proof_calculation.end_sequence.borrow();
        if (
            sequences[0]==proof_calculation.start_sequence && 
            sequences[vector::length(&sequences)-1] == end_sequence
        ) {
            finish_proof_calculation(
                proof_calculation,
                end_sequence,
                da_hash,
                clock,
            );
            return true
        }
    };
    false
}
