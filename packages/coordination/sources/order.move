module dex::order;

public struct Order has copy, drop, store {
    amount: u64,
    price: u64,
    isSome: bool,
}

public(package) fun create_order(amount: u64, price: u64): Order {
    Order { amount, price, isSome: amount > 0 && price > 0 }
}

public(package) fun get_order(order: &Order): (u64, u64, bool) {
    (order.amount, order.price, order.isSome)
}
