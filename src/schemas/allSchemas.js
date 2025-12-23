const userSchema = require('./user.schema');
const userTypeSchema = require('./usertype.schema');
const sizeSchema = require('./size.schema');
const tagSchema = require('./tag.schema');
const colorSchema = require('./color.schema');
const brandLogoSchema = require('./brandlogo.schema');
const categorySchema = require('./category.schema');
const productSchema = require('./product.schema');

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
        }
    }
}
module.exports = AllSchemas;