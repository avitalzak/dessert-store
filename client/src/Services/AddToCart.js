export function addToCartLogic(item, quantity = item.quantity || 1) {
    return {
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity,
        image: item.image || "",
        components: item.components?.map(c => c._id || c) || []
    }
}