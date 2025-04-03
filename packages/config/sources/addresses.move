module dex_config::addresses;

use std::string::String;
use sui::display;
use sui::event;
use sui::package;

public struct DexConfig has key {
    id: UID,
    admin: address,
    dex_package: address,
    dex_object: address,
    circuit_blob_id: String,
    mina_network: String,
    mina_chain: String,
    mina_contract: String,
}

public struct ConfigCreatedEvent has copy, drop {
    admin: address,
    config: address,
}

public struct ConfigEvent has copy, drop {
    admin: address,
    dex_package: address,
    dex_object: address,
    circuit_blob_id: String,
    mina_network: String,
    mina_chain: String,
    mina_contract: String,
}

public struct ADDRESSES has drop {}

public struct ConfigAdmin has key {
    id: UID,
    admin: address,
    created: bool,
}

fun init(otw: ADDRESSES, ctx: &mut TxContext) {
    let id = object::new(ctx);
    let address = id.to_address();

    let admin = ConfigAdmin { id, admin: ctx.sender(), created: false };
    transfer::transfer(admin, ctx.sender());
    event::emit(ConfigCreatedEvent {
        admin: ctx.sender(),
        config: address,
    });

    let publisher = package::claim(otw, ctx);

    let keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"description".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let values = vector[
        b"Silvana DEX Configuration".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"Silvana DEX configuration for Mina protocol".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"DFST".to_string(),
    ];
    let mut display_config = display::new_with_fields<DexConfig>(
        &publisher,
        keys,
        values,
        ctx,
    );
    display_config.update_version();
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display_config, ctx.sender());
}

#[error]
const ENotAuthorized: vector<u8> = b"Not authorized";

#[error]
const EConfigAlreadyCreated: vector<u8> = b"Config already created";

public fun update_config(
    dex_config: &mut DexConfig,
    dex_package: address,
    dex_object: address,
    circuit_blob_id: String,
    mina_network: String,
    mina_chain: String,
    mina_contract: String,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == dex_config.admin, ENotAuthorized);
    dex_config.dex_package = dex_package;
    dex_config.dex_object = dex_object;
    dex_config.circuit_blob_id = circuit_blob_id;
    dex_config.mina_network = mina_network;
    dex_config.mina_chain = mina_chain;
    dex_config.mina_contract = mina_contract;
    event::emit(ConfigEvent {
        admin: ctx.sender(),
        dex_package,
        dex_object,
        circuit_blob_id,
        mina_network,
        mina_chain,
        mina_contract,
    });
}

public fun create_config(
    config_admin: &mut ConfigAdmin,
    dex_package: address,
    dex_object: address,
    circuit_blob_id: String,
    mina_network: String,
    mina_chain: String,
    mina_contract: String,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == config_admin.admin, ENotAuthorized);
    assert!(!config_admin.created, EConfigAlreadyCreated);
    let config: DexConfig = DexConfig {
        id: object::new(ctx),
        admin: ctx.sender(),
        dex_package,
        dex_object,
        circuit_blob_id,
        mina_network,
        mina_chain,
        mina_contract,
    };
    transfer::transfer(config, ctx.sender());
    event::emit(ConfigEvent {
        admin: ctx.sender(),
        dex_package,
        dex_object,
        circuit_blob_id,
        mina_network,
        mina_chain,
        mina_contract,
    });
    config_admin.created = true;
}
