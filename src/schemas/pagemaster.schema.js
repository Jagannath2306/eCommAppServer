module.exports = {
    components: {
        schemas: {
            InsertPageMaster: {
                type: "object",
                required: ['moduleId', 'subModuleId', 'name', 'icon', 'url', 'defaultActive', 'menuRank', "pageCode"],
                properties: {
                    moduleId: { type: "string" },
                    subModuleId: { type: "string" },
                    name: { type: "string" },
                    icon: { type: "string" },
                    url: { type: "string" },
                    defaultActive: { type: "boolean" },
                    menuRank: { type: "number" },
                    pageCode: { type: "string" }
                }
            },
            UpdatePageMaster: {
                type: "object",
                required: ['id', 'moduleId', 'subModuleId', 'name', 'icon', 'url', 'defaultActive', 'menuRank', 'pageCode'],
                properties: {
                    id: { type: "string" },
                    moduleId: { type: "string" },
                    subModuleId: { type: "string" },
                    name: { type: "string" },
                    icon: { type: "string" },
                    url: { type: "string" },
                    defaultActive: { type: "boolean" },
                    menuRank: { type: "number" },
                    pageCode: { type: "string" }
                }
            },
            GetAllPageMasters: {
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
            GetPageMasterById: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            },
            GetPageByModuleIdBySubModuleIdByUserType: {
                type: "object",
                required: ['moduleId', 'subModuleId', 'userTypeId'],
                properties: {
                    moduleId: { type: "string" },
                    subModuleId: { type: "string" },
                    userTypeId: { type: "string" },
                }
            },
            DeletePageMaster: {
                type: "object",
                required: ['id'],
                properties: {
                    id: { type: "string" }
                }
            }
        }
    }
}
