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
                        type: "object",
                        minProperties: 1,
                        additionalProperties: false,
                        properties: {
                            view: { type: "boolean" },
                            create: { type: "boolean" },
                            edit: { type: "boolean" },
                            delete: { type: "boolean" },
                            approve: { type: "boolean" },
                            reject: { type: "boolean" },
                            block: { type: "boolean" },
                            unblock: { type: "boolean" }
                        }
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
                        type: "object",
                        minProperties: 1,
                        additionalProperties: false,
                        properties: {
                            view: { type: "boolean" },
                            create: { type: "boolean" },
                            edit: { type: "boolean" },
                            delete: { type: "boolean" },
                            approve: { type: "boolean" },
                            reject: { type: "boolean" },
                            block: { type: "boolean" },
                            unblock: { type: "boolean" }
                        }
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
