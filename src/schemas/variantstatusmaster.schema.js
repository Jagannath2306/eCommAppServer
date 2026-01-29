module.exports = {
    components: {
        schemas: {
            InsertVariantStatusMaster: {
                type: "object",
                required: ["code", "name", "color", "description", "isSelectable", "isSellable"],
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
                    description: {
                        type: "string",
                    },
                    isSelectable: {
                        type: "boolean",
                    },
                    isSellable: {
                        type: "boolean",
                    }
                },

            },
            UpdateVariantStatusMaster: {
                type: "object",
                required: ["id", "code", "name", "color", "description", "isSelectable", "isSellable"],
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
                    description: {
                        type: "string"
                    },
                    isSelectable: {
                        type: "boolean"
                    },
                    isSellable: {
                        type: "boolean"
                    }
                }
            },
            GetAllVariantStatusMaster: {
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
            GetVariantStatusMasterById: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            DeleteVariantStatusMaster: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}