require('dotenv').config();
const express = require('express');
const app = express();
require('express-async-errors');
require('./database/db.connection')();
const handleError = require('./middlewares/error.handle.middleware');

const path = require('path'); 

const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.json());

const cors = require('cors');
app.use(cors());



const helmet = require('helmet');
// app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
  })
);


const APIRouter = express.Router();
APIRouter.get('/', (req, res) => {
    res.json({ message: "API is Working.." });
});


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api', APIRouter);

const routers = require('./routers/routers');
APIRouter.use('/UserType', routers.userTypeRouter);
APIRouter.use('/User', routers.userRouter);
APIRouter.use('/ProductVariant', routers.productVariantRoute);
APIRouter.use('/Size', routers.sizeRouter);
APIRouter.use('/Tag', routers.tagRouter);
APIRouter.use('/Color', routers.colorRouter);
APIRouter.use('/Category', routers.categoryRouter);
APIRouter.use('/Product', routers.productRouter);
APIRouter.use('/BrandLogo', routers.brandLogoRouter);
APIRouter.use('/Customer', routers.customerRouter);
APIRouter.use('/ContactUs', routers.contactusRouter);
APIRouter.use('/CustomerAddress', routers.customerAddressRoute);
APIRouter.use('/ProductStatusMaster', routers.productstatusmasterRoute);
APIRouter.use('/VariantStatusMaster', routers.variantstatusmasterRoute);
APIRouter.use('/ProductStatusMapping', routers.productstatusmappingRoute);
APIRouter.use('/ModuleMaster', routers.modulemasterRoute);
APIRouter.use('/SubModuleMaster', routers.submodulemasterRoute);
APIRouter.use('/PageMaster', routers.pagemasterRoute);
APIRouter.use('/UserPageRights', routers.userpagerightsRoute);
APIRouter.use('/PaymentType', routers.paymenttypeRoute);
APIRouter.use('/PaymentStatus', routers.paymentstatusRoute);
APIRouter.use('/OrderStatus', routers.orderstatusRoute);
APIRouter.use('/Payment', routers.paymentRoute);
APIRouter.use('/PagePermission', routers.pagePermissionRoute);
APIRouter.use('/RolePermission', routers.rolePermissionRoute);


// APIRouter.get(`/${process.env.PRODUCT_IMAGE_PATH}/*`, (req, res) => {
//     const filePath = req.params[0];
//     console.log("**")
//     console.log(filePath)
//     res.sendFile(filePath, { root: `./${process.env.PRODUCT_IMAGE_PATH}` }, (err)=>{
//         if(err){
//             res.status(404).json({success: false, message : "Image Not Found"});
//         }
//     });
// })
// APIRouter.get(`/${process.env.PRODUCT_IMAGE_PATH}/*`, (req, res) => {
//     const filePath = req.params[0];

//     const absoluteRootPath = path.join(
//         process.cwd(),
//         process.env.PRODUCT_IMAGE_PATH
//     );

//     res.sendFile(filePath, { root: absoluteRootPath }, (err) => {
//         if (err) {
//             console.error('Image not found:', err.message);
//             res.status(404).json({
//                 success: false,
//                 message: 'Image Not Found'
//             });
//         }
//     });
// });

APIRouter.get('/images/products/:filename', (req, res) => {
    const fileName = req.params.filename;
    
    // Construct absolute path to avoid "Image Not Found"
    const options = {
        root: path.join(__dirname, '../images/products'), // Adjust '../' based on your folder depth
        dotfiles: 'deny'
    };

    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log("Error looking for:", fileName, "in", options.root);
            res.status(404).json({ success: false, message: "Image Not Found" });
        }
    });
});
// error handling middleware
app.use(handleError);

//Swagger Implementation
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = require('./swagger');
const swaggerDocs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;