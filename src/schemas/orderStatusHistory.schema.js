module.exports = {
    components: {
        schemas: {
            saveStatusHistory: {
                type: "object",
                required: ['orderId', 'statusId', "comment"],
                properties: {
                    orderId: { type: "string" },
                    statusId: { type: "string" },
                    comment: { type: "string" },
                }
            },
            updateStatusHistory: {
                type: "object",
                required: ['id', 'orderId', 'statusId', "comment"],
                properties: {
                    id: { type: "string" },
                    orderId: { type: "string" },
                    statusId: { type: "string" },
                    comment: { type: "string" },
                }
            },
            getAllStatusHistories: {
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
            deleteStatusHistory: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}

