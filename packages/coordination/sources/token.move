module dex::token;

use dex::admin::{Admin, get_admin_address};
use std::string::String;
use sui::display;
use sui::event;
use sui::package;

public struct Token has key, store {
    id: UID,
    publicKey: u256,
    publicKeyBase58: String,
    tokenId: u256,
    token: String,
    name: String,
    description: String,
    image: String,
}

public struct TokenCreateEvent has copy, drop {
    address: address,
    publicKey: u256,
    publicKeyBase58: String,
    tokenId: u256,
    token: String,
    name: String,
    description: String,
    image: String,
}

public struct TOKEN has drop {}

fun init(otw: TOKEN, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let token_keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let token_values = vector[
        b"{name}".to_string(),
        b"https://minascan.io/devnet/account/{publicKeyBase58}".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"DFST".to_string(),
    ];
    let mut display_token = display::new_with_fields<Token>(
        &publisher,
        token_keys,
        token_values,
        ctx,
    );

    display_token.update_version();
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display_token, ctx.sender());
}

#[error]
const ENotAuthorized: vector<u8> = b"Not authorized";

public fun create_token(
    admin: &Admin,
    publicKey: u256,
    publicKeyBase58: String,
    tokenId: u256,
    token: String,
    name: String,
    description: String,
    image: String,
    ctx: &mut TxContext,
): (Token, TokenCreateEvent) {
    assert!(get_admin_address(admin) == ctx.sender(), ENotAuthorized);
    let id = object::new(ctx);
    let address = id.to_address();
    let token = Token {
        id,
        publicKey,
        publicKeyBase58,
        tokenId,
        token,
        name,
        description,
        image,
    };
    let token_create_event = TokenCreateEvent {
        address,
        publicKey: token.publicKey,
        publicKeyBase58: token.publicKeyBase58,
        tokenId: token.tokenId,
        token: token.token,
        name: token.name,
        description: token.description,
        image: token.image,
    };
    event::emit(token_create_event);
    (token, token_create_event)
}
