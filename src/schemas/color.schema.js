module.exports = {
    components: {
        schemas: {
            InsertColor: {
                type: "object",
                required: ['name', 'code', "color"],
                properties: {
                    name: { type: "string" },
                    code: { type: "string" },
                    color: { type: "string" },
                }
            },
            UpdateColor: {
                type: "object",
                required: ['id', 'name', 'code', "color"],
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    code: { type: "string" },
                    color: { type: "string" },
                }
            },
            GetAllColors: {
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
            DeleteColor: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}

