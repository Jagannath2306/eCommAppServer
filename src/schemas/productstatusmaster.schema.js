module.exports = {
    components: {
        schemas: {
            InsertProductStatusMaster: {
                type: "object",
                required: ["code", "name", "color", "sortOrder", "description", "isCustomerVisible", "isSellable"],
                properties: {
                    code: {
                        type: "string",
                    },
                    name: {
                        type: "string",
                    },
                    color: {
                        type: "string",
                    },
                    sortOrder: {
                        type: "number",
                    },
                    description: {
                        type: "string",
                    },
                    isCustomerVisible: {
                        type: "boolean",
                    },
                    isSellable: {
                        type: "boolean",
                    }
                },

            },
            UpdateProductMasterStatus: {
                type: "object",
                required: ["id", "code", "name", "color", "sortOrder", "description", "isCustomerVisible", "isSellable"],
                properties: {
                    id: {
                        type: "string",
                    },
                    code: {
                        type: "string",
                    },
                    name: {
                        type: "string",
                    },
                    color: {
                        type: "string",
                    },
                    sortOrder: {
                        type: "number",
                    },
                    description: {
                        type: "string"
                    },
                    isCustomerVisible: {
                        type: "boolean"
                    },
                    isSellable: {
                        type: "boolean"
                    }
                }
            },
            GetAllProductMasterStatus: {
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
            GetProductMasterStatusById: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            DeleteProductStatusMaster: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}