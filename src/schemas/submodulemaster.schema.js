module.exports = {
    components: {
        schemas: {
            GetAllSubModuleMaster: {
                type: "object",
                required: ['pageSize', 'page', "sortCol", "sort"],
                properties: {
                    pageSize: { type: "number" },
                    page: { type: "number" },
                    sortCol: { type: "string" },
                    sort: { type: "string" }
                }
            },
            GetSubModuleMasterById: {
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
