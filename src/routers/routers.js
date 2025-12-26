const userRouter = require("./user.router");
const userTypeRouter = require("./usertype.router");
const sizeRouter = require("./size.router");
const tagRouter = require("./tag.router");
const colorRouter = require("./color.router");
const brandLogoRouter = require("./brandlogo.router");
const categoryRouter = require("./category.router");
const productRouter = require("./product.router");
const customerRouter = require("./customer.router");
const contactusRouter = require("./contactus.router");
const customerAddressRoute = require("./customeraddress.router");
const productmasterstatusRoute = require("./productmasterstatus.router");
const productstatusmappingRoute = require("./productstatusmapping.router");
const modulemasterRoute = require("./modulemaster.router");
const submodulemasterRoute = require("./submodulemaster.router");

module.exports = {
    userTypeRouter,
    userRouter,
    sizeRouter,
    tagRouter,
    colorRouter,
    brandLogoRouter,
    categoryRouter,
    productRouter,
    customerRouter,
    contactusRouter,
    customerAddressRoute,
    productmasterstatusRoute,
    productstatusmappingRoute,
    modulemasterRoute,
    submodulemasterRoute
}