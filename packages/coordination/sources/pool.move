module dex::pool;

use dex::admin::{Admin, get_admin_address};
use dex::token::{Token, TokenCreateEvent};
use dex::user::UserTradingAccount;
use std::string::String;
use sui::clock::{timestamp_ms, Clock};
use sui::display;
use sui::event;
use sui::object_table;
use sui::package;
use sui::vec_map;
use sui::vec_set::{VecSet, empty, insert};

public struct Order has copy, drop, store {
    amount: u64,
    price: u64,
}
public struct Orders has key, store {
    id: UID,
    orders: vec_map::VecMap<u256, Order>,
}

public struct Pool has key, store {
    id: UID,
    name: String,
    publicKey: u256,
    publicKeyBase58: String,
    base_token: Token,
    quote_token: Token,
    last_price: u64,
    users: VecSet<u256>,
    accounts: object_table::ObjectTable<u256, UserTradingAccount>,
    bids: Orders,
    offers: Orders,
}

public struct PoolCreateEvent has copy, drop {
    address: address,
    name: String,
    publicKey: u256,
    publicKeyBase58: String,
    base_token: TokenCreateEvent,
    quote_token: TokenCreateEvent,
    created_at: u64,
}

public struct POOL has drop {}

fun init(otw: POOL, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let pool_keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let pool_values = vector[
        b"{name}".to_string(),
        b"https://minascan.io/devnet/account/{publicKeyBase58}".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"DFST".to_string(),
    ];

    let mut display_pool = display::new_with_fields<Pool>(
        &publisher,
        pool_keys,
        pool_values,
        ctx,
    );

    display_pool.update_version();
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display_pool, ctx.sender());
}

#[error]
const ENotAuthorized: vector<u8> = b"Not authorized";

public(package) fun create_pool(
    admin: &Admin,
    name: String,
    publicKey: u256,
    publicKeyBase58: String,
    base_token: Token,
    quote_token: Token,
    base_token_event: TokenCreateEvent,
    quote_token_event: TokenCreateEvent,
    initial_price: u64,
    clock: &Clock,
    ctx: &mut TxContext,
): Pool {
    assert!(get_admin_address(admin) == ctx.sender(), ENotAuthorized);
    let pool = Pool {
        id: object::new(ctx),
        name,
        publicKey,
        publicKeyBase58,
        base_token,
        quote_token,
        users: empty<u256>(),
        accounts: object_table::new<u256, UserTradingAccount>(ctx),
        bids: Orders {
            id: object::new(ctx),
            orders: vec_map::empty<u256, Order>(),
        },
        offers: Orders {
            id: object::new(ctx),
            orders: vec_map::empty<u256, Order>(),
        },
        last_price: initial_price,
    };
    let pool_address = pool.id.to_address();
    let timestamp = clock.timestamp_ms();

    let pool_create_event = PoolCreateEvent {
        address: pool_address,
        name: pool.name,
        publicKey: pool.publicKey,
        publicKeyBase58: pool.publicKeyBase58,
        base_token: base_token_event,
        quote_token: quote_token_event,
        created_at: timestamp,
    };

    event::emit(pool_create_event);
    pool
}

public(package) fun insert_account(
    pool: &mut Pool,
    publicKey: u256,
    account: UserTradingAccount,
) {
    object_table::add(&mut pool.accounts, publicKey, account);
    insert(&mut pool.users, publicKey);
}

public(package) fun is_account_exist(pool: &Pool, publicKey: u256): bool {
    object_table::contains(&pool.accounts, publicKey)
}

public fun get_name(pool: &Pool): String {
    pool.name
}

public fun get_public_key(pool: &Pool): u256 {
    pool.publicKey
}

public fun get_account(pool: &Pool, publicKey: u256): &UserTradingAccount {
    object_table::borrow(&pool.accounts, publicKey)
}

public(package) fun get__mut_account(
    pool: &mut Pool,
    publicKey: u256,
): &mut UserTradingAccount {
    object_table::borrow_mut(&mut pool.accounts, publicKey)
}

public(package) fun update_last_price(pool: &mut Pool, last_price: u64) {
    pool.last_price = last_price;
}

public(package) fun get_accounts(
    pool: &Pool,
): &object_table::ObjectTable<u256, UserTradingAccount> {
    &pool.accounts
}

public(package) fun get_users(pool: &Pool): &VecSet<u256> {
    &pool.users
}

public(package) fun update_bids(
    pool: &mut Pool,
    publicKey: u256,
    amount: u64,
    price: u64,
) {
    let is_exist = vec_map::contains(&pool.bids.orders, &publicKey);
    if (amount != 0 && price != 0) {
        if (is_exist) {
            let order = vec_map::get_mut(&mut pool.bids.orders, &publicKey);
            order.amount = amount;
            order.price = price;
        } else {
            vec_map::insert(
                &mut pool.bids.orders,
                publicKey,
                Order { amount, price },
            );
        }
    } else {
        if (is_exist) {
            vec_map::remove(&mut pool.bids.orders, &publicKey);
        }
    }
}

public(package) fun update_offers(
    pool: &mut Pool,
    publicKey: u256,
    amount: u64,
    price: u64,
) {
    let is_exist = vec_map::contains(&pool.offers.orders, &publicKey);
    if (amount != 0 && price != 0) {
        if (is_exist) {
            let order = vec_map::get_mut(&mut pool.offers.orders, &publicKey);
            order.amount = amount;
            order.price = price;
        } else {
            vec_map::insert(
                &mut pool.offers.orders,
                publicKey,
                Order { amount, price },
            );
        }
    } else {
        if (is_exist) {
            vec_map::remove(&mut pool.offers.orders, &publicKey);
        }
    }
}
