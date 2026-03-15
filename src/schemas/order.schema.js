module.exports = {
    components: {
        schemas: {

            SaveOrder: {
                type: "object",
                required: [
                    "customerId",
                    "paymentTypeId",
                    "billingAddress",
                    "items"
                ],
                properties: {

                    customerId: { type: "string" },
                    paymentTypeId: { type: "string" },

                    billingAddress: {
                        type: "object",
                        required: ["name", "mobile", "address", "city", "pincode"],
                        properties: {
                            name: { type: "string" },
                            mobile: { type: "string" },
                            address: { type: "string" },
                            city: { type: "string" },
                            state: { type: "string" },
                            pincode: { type: "string" }
                        }
                    },

                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["variantId", "quantity"],
                            properties: {
                                variantId: { type: "string" },
                                quantity: { type: "number" }
                            }
                        }
                    }

                }
            },
            cancelOrder: {
                type: "object",
                required: ["cancelReason"],
                properties: {
                    cancelReason: {
                        type: "string"
                    }
                }
            }
        }
    }
}