require('dotenv').config();
const express = require('express');
const app =  express();
require('express-async-errors');
require('./database/db.connection')();
const handleError =  require('./middlewares/error.handle.middleware');


const morgan =  require('morgan');
app.use(morgan('dev'));

app.use(express.json());

const cors =  require('cors');
app.use(cors());



const helmet = require('helmet');
app.use(helmet());


const APIRouter =  express.Router();
APIRouter.get('/', (req,res) => {
    res.json({message : "API is Working.."});
});


app.use('/api',APIRouter);

const routers = require('./routers/routers');
APIRouter.use('/UserType',routers.userTypeRouter );
APIRouter.use('/User',routers.userRouter);
APIRouter.use('/Size',routers.sizeRouter);
APIRouter.use('/Tag',routers.tagRouter);
APIRouter.use('/Color',routers.colorRouter);
APIRouter.use('/BrandLogo',routers.brandLogoRouter);
APIRouter.use('/Category',routers.categoryRouter);
APIRouter.use('/Product',routers.productRouter);
APIRouter.use('/Customer',routers.customerRouter);
APIRouter.use('/ContactUs',routers.contactusRouter);
APIRouter.use('/CustomerAddress',routers.customerAddressRoute);
APIRouter.use('/ProductMasterStatus',routers.productmasterstatusRoute);
APIRouter.use('/ProductStatusMapping',routers.productstatusmappingRoute);
APIRouter.use('/ModuleMaster',routers.modulemasterRoute);
APIRouter.use('/SubModuleMaster',routers.submodulemasterRoute);
APIRouter.use('/PageMaster',routers.pagemasterRoute);
APIRouter.use('/UserPageRights',routers.userpagerightsRoute);
APIRouter.use('/PaymentType',routers.paymenttypeRoute);
APIRouter.use('/PaymentStatus',routers.paymentstatusRoute);
APIRouter.use('/OrderStatus',routers.orderstatusRoute);
APIRouter.use('/Payment',routers.paymentRoute);
APIRouter.use('/PagePermission',routers.pagePermissionRoute);
APIRouter.use('/RolePermission',routers.rolePermissionRoute);

APIRouter.get(`/${process.env.BRANDLOGO_IMAGE_PATH}/*`, (req, res) => {
    const filePath = req.params[0];
    res.sendFile(filePath, { root: `./${process.env.BRANDLOGO_IMAGE_PATH}` }, (err)=>{
        if(err){
            res.status(404).json({success: false, message : "Image Not Found"});
        }
    });
})
APIRouter.get(`/${process.env.CATEGORY_IMAGE_PATH}/*`, (req, res) => {
    const filePath = req.params[0];
    res.sendFile(filePath, { root: `./${process.env.CATEGORY_IMAGE_PATH}` }, (err)=>{
        if(err){
            res.status(404).json({success: false, message : "Image Not Found"});
        }
    });
})
APIRouter.get(`/${process.env.MENU_ICON_IMAGE_PATH}/*`, (req, res) => {
    const filePath = req.params[0];
    res.sendFile(filePath, { root: `./${process.env.MENU_ICON_IMAGE_PATH}` }, (err)=>{
        if(err){
            res.status(404).json({success: false, message : "Image Not Found"});
        }
    });
})

// error handling middleware
app.use(handleError);

//Swagger Implementation
const swaggerJSDoc =  require('swagger-jsdoc');
const swaggerUi =  require('swagger-ui-express');
const options = require('./swagger');
const swaggerDocs = swaggerJSDoc(options);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

module.exports = app;