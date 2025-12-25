const userSchema = require('./user.schema');
const userTypeSchema = require('./usertype.schema');
const sizeSchema = require('./size.schema');
const tagSchema = require('./tag.schema');
const colorSchema = require('./color.schema');
const brandLogoSchema = require('./brandlogo.schema');
const categorySchema = require('./category.schema');
const productSchema = require('./product.schema');
const customerSchema = require('./customer.schema');
const contactusSchema = require('./contactus.schema');
const customerAddressSchema = require('./customeraddress.schema');
const productmasterstatusSchema = require('./productmasterstatus.schema');
const productstatusmappingSchema = require('./productstatusmapping.schema');
const modulemasterSchema = require('./modulemaster.schema');

const AllSchemas = {
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ...userSchema.components.schemas,
            ...userTypeSchema.components.schemas,
            ...sizeSchema.components.schemas,
            ...tagSchema.components.schemas,
            ...colorSchema.components.schemas,
            ...brandLogoSchema.components.schemas,
            ...categorySchema.components.schemas,
            ...productSchema.components.schemas,
            ...customerSchema.components.schemas,
            ...contactusSchema.components.schemas,
            ...customerAddressSchema.components.schemas,
            ...productmasterstatusSchema.components.schemas,
            ...productstatusmappingSchema.components.schemas,
            ...modulemasterSchema.components.schemas
        }
    }
}
module.exports = AllSchemas;