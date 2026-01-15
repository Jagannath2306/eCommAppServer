const { number } = require("joi");

module.exports = {
    components: {
        schemas: {
            UserRegister: {
                type: "object",
                required: ["firstName", "lastName", "email", "userTypeId", "password"],
                properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    email: { type: "string" },
                    userTypeId: { type: "string" },
                    password: { type: "string" },
                    confirmPassword: { type: "string" }
                },
            },

            UserLogin: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                },
            },

            UpdateProfile: {
                type: "object",
                required: ["firstName", "lastName","userTypeId","id"],
                properties: {
                    id: { type: "string" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    userTypeId: { type: "string" }
                },
            },
            GetAllUser: {
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

            ForgotUserPassword: {
                type: "object",
                required: ['email'],
                properties: {
                    email: { type: "string" }
                }
            },
            
            ResetUserPassword: {
                type: "object",
                required: ['resetToken', 'otp', 'newPassword', 'confirmPassword'],
                properties: {
                    resetToken: { type: "string" },
                    otp: { type: 'string' },
                    newPassword: { type: "string" },
                    confirmPassword: { type: "string" }
                }
            },
             ResendUserOtp: {
                type: "object",
                required: ['resetToken'],
                properties: {
                    resetToken: { type: "string" }
                }
            }
        },
    },
};
