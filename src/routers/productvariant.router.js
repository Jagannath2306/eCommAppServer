const express = require('express');
const productVariantRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const {
    saveProductVariant,
    updateProductVariant,
    getAllProductVariant,
    getProductVariantById,
    deleteProductVariant
} = require('../controllers/productvariant.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : ProductVariant
 * description : API for managing ProductVariants 
 */



/**
 * @swagger
 * /api/ProductVariant/Save:
 *   post:
 *     summary: Insert New Product Variant
 *     tags: [ProductVariant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertProductVariant'
 *     responses:
 *       201:
 *         description: Product Variant Saved Successfully
 */
productVariantRouter.post('/Save', authMiddleware,checkPermission("PRODUCT_LIST","create"), saveProductVariant);


/**
  * @swagger
  * /api/ProductVariant/Update:
  *   post:
  *     summary: Update Product Variant
  *     tags: [ProductVariant]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateProductVariant'
  *     responses:
  *       201:
  *         description: Product Variant updated successfully.
  */
productVariantRouter.post('/Update', authMiddleware,checkPermission("PRODUCT_LIST","edit"), updateProductVariant);
/**
  * @swagger
  * /api/ProductVariant/GetAll:
  *   post:
  *     summary: Get All Product Variants
  *     tags: [ProductVariant]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllProductVariant'
  *     responses:
  *       200:
  *         description: Success
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 type: object
  */
productVariantRouter.post('/GetAll', authMiddleware,checkPermission("PRODUCT_LIST","view"), getAllProductVariant);

/**
  * @swagger
  * /api/ProductVariant/GetById/{id}:
  *   get:
  *     summary: Get ProductVariant by Id
  *     tags: [ProductVariant]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: Product Variant Id
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Returns Product Variant object.
  */
productVariantRouter.get('/GetById/:id', authMiddleware,checkPermission("PRODUCT_LIST","view"), getProductVariantById);

/**
  * @swagger
  * /api/ProductVariant/Delete:
  *   post:
  *     summary: Delete Product Variant
  *     tags: [ProductVariant]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteProductVariant'
  *     responses:
  *       200:
  *         description: ProductVariant deleted successfully.
  */
productVariantRouter.post('/Delete', authMiddleware,checkPermission("PRODUCT_LIST","delete"), deleteProductVariant);


module.exports = productVariantRouter;