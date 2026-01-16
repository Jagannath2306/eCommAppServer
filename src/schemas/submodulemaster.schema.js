module.exports = {
    components: {
        schemas: {
            SaveSubModuleMaster: {
                type: "object",
                required: ['moduleId','name', 'icon', 'defaultActive', 'url', 'menuRank'],
                properties: {
                    moduleId: { type: "string" },
                    name: { type: "string" },
                    icon: { type: "string" },
                    defaultActive: { type: "boolean" },
                    url: { type: "string" },
                    menuRank: { type: "number" },
                }
            },
            UpdateSubModuleMaster: {
                type: "object",
                required: ['moduleId','id', 'name', 'icon', 'defaultActive', 'url', 'menuRank'],
                properties: {
                    id: { type: "string" },
                    moduleId: { type: "string" },
                    name: { type: "string" },
                    icon: { type: "string" },
                    defaultActive: { type: "boolean" },
                    url: { type: "string" },
                    menuRank: { type: "number" },
                }
            },
            GetAllSubModuleMaster: {
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
            GetSubModuleMasterById: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            GetSubModuleByModuleId: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            DeleteSubModuleMaster: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}
