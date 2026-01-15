module.exports = {
    components: {
        schemas: {
            InsertPagePermission: {
                type: "object",
                required: ['moduleId', 'subModuleId', 'pageId', 'actions'],
                properties: {
                    moduleId: { type: "string" },
                    subModuleId: { type: "string" },
                    pageId: { type: "string" },
                    actions: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: ['view', 'create', 'edit', 'delete', "approve", "reject", "block", "unblock"]
                        },
                        minItems: 1
                    }
                }
            },
            UpdatePagePermission: {
                type: "object",
                required: ['id', 'moduleId', 'subModuleId', 'pageId', 'actions'],
                properties: {
                    id: { type: "string" },
                    moduleId: { type: "string" },
                    subModuleId: { type: "string" },
                    pageId: { type: "string" },
                     actions: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: ['view', 'create', 'edit', 'delete', "approve", "reject", "block", "unblock"]
                        },
                        minItems: 1
                    }
                }
            },
            GetAllPagePermission: {
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
            GetPagePermissionById: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            DeletePagePermission: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}
