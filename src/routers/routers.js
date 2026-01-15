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
const pagemasterRoute = require("./pagemaster.router");
const userpagerightsRoute = require("./userpagerights.router");
const paymenttypeRoute = require("./paymenttype.router");
const paymentstatusRoute = require("./paymentstatus.router");
const orderstatusRoute = require("./orderstatus.router");
const paymentRoute = require("./payment.router");
const pagePermissionRoute = require("./pagepermissionmaster.router");
const rolePermissionRoute = require("./rolepagepermission.router");

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
    submodulemasterRoute,
    pagemasterRoute,
    userpagerightsRoute,
    paymenttypeRoute,
    paymentstatusRoute,
    orderstatusRoute,
    paymentRoute,
    pagePermissionRoute,
    rolePermissionRoute
}