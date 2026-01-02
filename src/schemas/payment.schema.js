module.exports = {
    components: {
        schemas: {
            SavePaymentMaster: {
                type: "object",
                required: ['addressId', 'subTotalAmount', 'shippingAmount', 'totalAmount', 'paymentTypeId', 'items', 'payment'],
                properties: {
                    addressId: { type: "string" },
                    subTotalAmount: { type: 'number' },
                    shippingAmount: { type: 'number' },
                    totalAmount: { type: 'number' },
                    paymentTypeId: { type: "string" },
                    items: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['productId', 'sizeId', 'colorId', 'quantity', 'price', 'discount'],
                            properties: {
                                productId: { type: "string" },
                                sizeId: { type: "string" },
                                colorId: { type: "string" },
                                quantity: { type: "number" },
                                price: { type: "number" },
                                discount: { type: "number" },
                            }
                        }
                    },
                    payment: {
                        type: 'object',
                        required: ['tokenId', 'description', 'amount'],
                        properties: {
                            tokenId: { type: "string" },
                            description: { type: "string" },
                            amount: { type: "number" }
                        }
                    }
                }
            }
        }
    }
}

