#[test_only]
module dex::dex_tests;

use std::debug;
use sui::bcs;
use sui::hash::blake2b256;

const ENotImplemented: u64 = 0;

#[test]
fun test_dex() {}

#[test, expected_failure(abort_code = ::dex::dex_tests::ENotImplemented)]
fun test_dex_fail() {
    abort ENotImplemented
}

#[test]
fun test_blake() {
    let value = vector[
        123,
        256,
        1235735873657836587,
        7684974986948578787,
        9858467863563667345,
        837558356534763658,
        8538547465,
    ];
    let mut bytes = vector::empty<u8>();
    let mut i = 0;
    while (i < vector::length(&value)) {
        vector::append(&mut bytes, bcs::to_bytes(&value[i]));
        i = i + 1;
    };

    let hash = blake2b256(&bytes);
    debug::print(&hash);
}
