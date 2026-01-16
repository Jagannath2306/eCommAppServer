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
            UpdateRolePermission: {
                type: "object",
                required: ['id', 'userTypeId', 'pageId', 'actions'],
                properties: {
                    id: { type: "string" },
                    userTypeId: { type: "string" },
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
            SaveAndUpdatePermissions: {
                type: "object",
                required: ["userTypeId", "permissions"],
                additionalProperties: false,
                properties: {
                    userTypeId: {
                        type: "string",
                    },
                    permissions: {
                        type: "array",
                        minItems: 1,
                        items: {
                            type: "object",
                            required: ["pageId", "actions"],
                            additionalProperties: false,
                            properties: {
                                pageId: {
                                    type: "string",
                                },
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
                        }
                    }
                }
            }
            ,
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
