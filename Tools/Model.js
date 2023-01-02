module.exports = {
    typeItems: 'items',
    typeOrders: 'orders',
    itemsModel: {
        item: String,
        price: Number,
        in_stock: Number
    },
    ordersModel: {
        name: String,
        email: String,
        info: String,
        notes: String
    }
}