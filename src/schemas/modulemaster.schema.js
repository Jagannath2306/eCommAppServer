module.exports = {
    components: {
        schemas: {
            SaveModuleMaster: {
                type: "object",
                required: ['name', 'icon', 'defaultActive', 'url', 'menuRank'],
                properties: {
                    name: { type: "string" },
                    icon: { type: "string" },
                    defaultActive: { type: "boolean" },
                    url: { type: "string" },
                    menuRank: { type: "number" },
                }
            },
            UpdateModuleMaster: {
                type: "object",
                required: ['id','name', 'icon', 'defaultActive','url', 'menuRank'],
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    icon: { type: "string" },
                    defaultActive: { type: "boolean" },
                    url: { type: "string" },
                    menuRank: { type: "number" },
                }
            },
            GetAllModuleMaster: {
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

