module.exports = {
    components: {
        schemas: {
            GetAllProducts: {
                type: "object",
                required: ['pageSize', 'page', "sortCol", "sort"],
                properties: {
                    pageSize: { type: "string" },
                    page: { type: "string" },
                    sortCol: { type: "string" },
                    sort: { type: "string" }
                }
            },
            DeleteProduct: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}

