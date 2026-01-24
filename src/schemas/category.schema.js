module.exports = {
    components: {
        schemas: {
            GetAllCategories: {
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
            InsertCategory: {
                type: "object",
                required: ["name", "title", "imagePath","code"],
                properties: {
                    name: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                    },
                    code: {
                        type: "string",
                    },
                    imagePath: {
                        type: "string",
                        format: "binary",
                    }
                }
            },
            UpdateCategory: {
                type: "object",
                required: ["id", "name", "title","code"],
                properties: {
                    id: {
                        type: "string",
                    },
                    name: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                    },
                    code: {
                        type: "string",
                    },
                    imagePath: {
                        type: "string",
                        format: "binary"
                    }
                }
            },
            DeleteCategory: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}

