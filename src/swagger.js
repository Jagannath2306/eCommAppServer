const AllSchemas = require("./schemas/allSchemas");
const options = {
    definition: {
        openapi : "3.0.0",  // Version of OpenAPI tells the swagger version
        info: {
            title: "eCommApp Rest API",
             version: "1.0.0",  // Version of the API
            description: "A Rest API With Express And Mongodb"
        },
        components: AllSchemas.components,
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: [
        "./src/routers/usertype.router.js",
        "./src/routers/user.router.js",
        "./src/routers/productvariant.router.js",
        "./src/routers/size.router.js",
        "./src/routers/tag.router.js",
        "./src/routers/color.router.js",
        "./src/routers/category.router.js",
        "./src/routers/product.router.js",
        "./src/routers/brandlogo.router.js",
        "./src/routers/customer.router.js",
        "./src/routers/contactus.router.js",
        "./src/routers/customeraddress.router.js",
        "./src/routers/productmasterstatus.router.js",
        "./src/routers/productstatusmapping.router.js",
        "./src/routers/modulemaster.router.js",
        "./src/routers/submodulemaster.router.js",
        "./src/routers/pagemaster.router.js",
        "./src/routers/userpagerights.router.js",
        "./src/routers/paymenttype.router.js",
        "./src/routers/paymentstatus.router.js",
        "./src/routers/orderstatus.router.js",
        "./src/routers/payment.router.js",
        "./src/routers/pagepermissionmaster.router.js",
        "./src/routers/rolepagepermission.router.js",
    ]
}
module.exports = options;