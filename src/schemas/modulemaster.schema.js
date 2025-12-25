module.exports = {
    components: {
        schemas: {
            GetAllModuleMaster: {
                type: "object",
                required: ['pageSize', 'page', "sortCol", "sort"],
                properties: {
                    pageSize: { type: "number" },
                    page: { type: "number" },
                    sortCol: { type: "string" },
                    sort: { type: "string" }
                }
            },
            GetModuleMasterById: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            DeleteModuleMaster: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}

