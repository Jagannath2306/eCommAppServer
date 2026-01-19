module.exports = {
    components: {
        schemas: {
            InsertProductVariant: {
                type: "object",
                required: ["productId", "colorId", "sizeId", "price", "stock"],
                properties: {
                    productId: {
                        type: "string",
                    },
                    colorId: {
                        type: "string",
                    },
                    sizeId: {
                        type: "string",
                    },
                    price: {
                        type: "number",
                    },
                    stock: {
                        type: "integer",
                    }
                }
            },
            UpdateProductVariant: {
                type: "object",
                required: ["id", "price", "stock"],
                properties: {
                    id: {
                        type: "string",
                    },
                    price: {
                        type: "number",
                    },
                    stock: {
                        type: "integer",
                    }
                }
            },
            GetAllProductVariant: {
                type: "object",
                required: ['pageSize', 'page', "sortCol", "sort"],
                properties: {
                    pageSize: {
                        type: "number",
                        default: 10
                    },
                    page: {
                        type: "number",
                        default: 1
                    },
                    sortCol: {
                        type: "string",
                    },
                    sort: {
                        type: "string",
                        default: "asc",
                    }
                }
            },
            DeleteProductVariant: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}

