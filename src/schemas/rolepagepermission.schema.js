module.exports = {
    components: {
        schemas: {
            InsertRolePermission: {
                type: "object",
                required: ['userTypeId', 'pageId', 'actions'],
                properties: {
                    userTypeId: { type: "string" },
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
            UpdateRolePermission: {
                type: "object",
                required: ['id', 'userTypeId', 'pageId', 'actions'],
                properties: {
                    id: { type: "string" },
                    userTypeId: { type: "string" },
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
            GetAllRolePermission: {
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
            GetRolePermissionById: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            DeleteRolePermission: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}
