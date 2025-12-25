
module.exports = {
    components: {
        schemas: {
            CustomerAddressRegister: {
                type: "object",
                required: ["firstName", "lastName", "phone", "country", "state", "city", "zipcode", "address", "landmark", "isDefault"],
                properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    phone: { type: "string" },
                    country: { type: "string" },
                    state: { type: "string" },
                    city: { type: "string" },
                    zipcode: { type: "number" },
                    address: { type: "string" },
                    landmark: { type: "string" },
                    isDefault: { type: "boolean" }
                },
            },
            UpdateCustomerAddress: {
                type: "object",
                required: ["id", "firstName", "lastName", "phone", "country", "state", "city", "zipcode", "address", "landmark", "isDefault"],
                properties: {
                    id: { type: "string" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    phone: { type: "string" },
                    country: { type: "string" },
                    state: { type: "string" },
                    city: { type: "string" },
                    zipcode: { type: "number" },
                    address: { type: "string" },
                    landmark: { type: "string" },
                    isDefault: { type: "boolean" }
                },
            },
            GetAllCustomerAddressById: {
                type: "object",
                required: ['pageSize', 'page', "sortCol", "sort"],
                properties: {
                    pageSize: { type: "number" },
                    page: { type: "number" },
                    sortCol: { type: "string" },
                    sort: { type: "string" }
                }
            },
            UpdateDefaultAddress: {
                type: "object",
                required: ['addressId'],
                properties: {
                    addressId: { type: "string" }
                }
            },
            DeleteAddress: {
                type: "object",
                required: ['addressId'],
                properties: {
                    addressId: { type: "string" }
                }
            },
        },
    },
};
