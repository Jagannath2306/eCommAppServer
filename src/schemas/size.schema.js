module.exports = {
    components: {
        schemas: {
            InsertSize: {
                type: "object",
                required: ['name',"code"],
                properties: {
                    name: { type: "string" },
                    code: { type: "string" }
                }
            },
            UpdateSize: {
                type: "object",
                required: ['id', 'name',"code"],
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    code: { type: "string" }
                }
            },
            GetAllSizes: {
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
            DeleteSize: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}

