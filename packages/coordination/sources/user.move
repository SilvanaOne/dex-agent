module dex::user;

use dex::mina::{MinaBalance, create_mina_balance, get_balance_data};
use dex::order::{Order, create_order, get_order};
use std::string::String;
use sui::display;
use sui::package;

public struct User has key, store {
    id: UID,
    publicKey: u256,
    publicKeyBase58: String,
    name: String,
    role: String,
    image: String,
}

public struct UserTradingAccount has key, store {
    id: UID,
    baseTokenBalance: MinaBalance,
    quoteTokenBalance: MinaBalance,
    bid: Order,
    ask: Order,
    nonce: u64,
}

public struct USER has drop {}

fun init(otw: USER, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);

    let user_keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"image_url".to_string(),
        b"thumbnail_url".to_string(),
        b"description".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let user_values = vector[
        b"{name}".to_string(),
        b"https://minascan.io/devnet/account/{publicKeyBase58}".to_string(),
        b"{image}".to_string(),
        b"{image}".to_string(),
        b"{role}".to_string(),
        b"https://dex.silvana.dev".to_string(),
        b"DFST".to_string(),
    ];
    let mut display_user = display::new_with_fields<User>(
        &publisher,
        user_keys,
        user_values,
        ctx,
    );

    display_user.update_version();
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display_user, ctx.sender());
}

public(package) fun create_user(
    publicKey: u256,
    publicKeyBase58: String,
    name: String,
    role: String,
    image: String,
    ctx: &mut TxContext,
): address {
    let user = User {
        id: object::new(ctx),
        publicKey,
        publicKeyBase58,
        name,
        role,
        image,
    };
    let user_address = user.id.to_address();
    transfer::freeze_object(user);
    user_address
}

public(package) fun copy_user_trading_account(
    account: &UserTradingAccount,
    ctx: &mut TxContext,
): UserTradingAccount {
    UserTradingAccount {
        id: object::new(ctx),
        baseTokenBalance: account.baseTokenBalance,
        quoteTokenBalance: account.quoteTokenBalance,
        bid: account.bid,
        ask: account.ask,
        nonce: account.nonce,
    }
}

public(package) fun create_user_trading_account(
    baseBalance: u64,
    quoteBalance: u64,
    ctx: &mut TxContext,
): UserTradingAccount {
    UserTradingAccount {
        id: object::new(ctx),
        baseTokenBalance: create_mina_balance(baseBalance, 0, 0),
        quoteTokenBalance: create_mina_balance(quoteBalance, 0, 0),
        bid: create_order(0, 0),
        ask: create_order(0, 0),
        nonce: 0,
    }
}

public(package) fun get_account_data(
    account: &UserTradingAccount,
): (u64, u64, u64) {
    let (base_amount, _, _) = get_balance_data(
        &account.baseTokenBalance,
    );
    let (quote_amount, _, _) = get_balance_data(
        &account.quoteTokenBalance,
    );
    (base_amount, quote_amount, account.nonce)
}

public(package) fun increment_nonce(account: &mut UserTradingAccount) {
    account.nonce = account.nonce + 1;
}

public(package) fun update_base_balance(
    account: &mut UserTradingAccount,
    balance: MinaBalance,
) {
    account.baseTokenBalance = balance;
}

public(package) fun update_quote_balance(
    account: &mut UserTradingAccount,
    balance: MinaBalance,
) {
    account.quoteTokenBalance = balance;
}

public(package) fun get_bid(account: &UserTradingAccount): (u64, u64, bool) {
    get_order(&account.bid)
}

public(package) fun update_bid(account: &mut UserTradingAccount, bid: Order) {
    account.bid = bid;
}

public(package) fun get_ask(account: &UserTradingAccount): (u64, u64, bool) {
    get_order(&account.ask)
}

public(package) fun update_ask(account: &mut UserTradingAccount, ask: Order) {
    account.ask = ask;
}

public(package) fun can_transfer(account: &UserTradingAccount): bool {
    let (_, _, base_borrowed_amount) = get_balance_data(
        &account.baseTokenBalance,
    );
    let (_, _, quote_borrowed_amount) = get_balance_data(
        &account.quoteTokenBalance,
    );
    base_borrowed_amount == 0 && quote_borrowed_amount == 0
}
