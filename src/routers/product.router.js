const express = require('express');
const productRouter = express.Router();
const { adminAuthMiddleware, authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveProduct, updateProduct, deleteProduct, getProductById, getAllProducts, getProductByCategoryId, getProducts } = require('../controllers/product.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : Product
 * description : API for managing Products 
 */

/**
 * @swagger
 * /api/product/Save:
 *   post:
 *     summary: Save new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - title
 *               - price
 *               - shortDetails
 *               - description
 *               - categoryIds
 *               - tagIds
 *               - imagePaths
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               shortDetails:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               imagePaths:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation or upload error
 */

productRouter.post('/Save', authMiddleware, checkPermission('PRODUCT_LIST', "create"), saveProduct);

/**
 * @swagger
 * /api/Product/Update:
 *   post:
 *     summary: Update Existing Product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - code
 *               - title
 *               - price
 *               - salePrice
 *               - shortDetails
 *               - description
 *               - quantity
 *               - discount
 *               - isNewItem
 *               - isSale
 *               - categoryId
 *               - tagId
 *               - colorId
 *               - sizeId
 *               - imagePaths
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *                 example: Shoes
 *               code:
 *                 type: string
 *                 example: SHOE001
 *               title:
 *                 type: string
 *                 example: Running Shoes
 *               price:
 *                 type: number
 *                 example: 2000
 *               salePrice:
 *                 type: number
 *                 example: 1500
 *               shortDetails:
 *                 type: string
 *                 example: Lightweight running shoes
 *               description:
 *                 type: string
 *                 example: Comfortable running shoes for daily use
 *               quantity:
 *                 type: number
 *                 example: 10
 *               discount:
 *                 type: number
 *                 example: 25
 *               isNewItem:
 *                 type: boolean
 *               isSale:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *               tagId:
 *                 type: string
 *               colorId:
 *                 type: string
 *               sizeId:
 *                 type: string
 *               imagePaths:
 *                 type: array
 *                 description: Upload exactly 5 product images
 *                 minItems: 5
 *                 maxItems: 5
 *                 items:
 *                   type: file
 *     responses:
 *        201:
 *          description: Product created successfully
 *        400:
 *          description: Validation or upload error
*/

productRouter.post('/Update', authMiddleware,checkPermission("PRODUCT_LIST", "edit"), updateProduct);
/**
  * @swagger
  * /api/Product/GetAll:
  *   post:
  *     summary: Get All Products
  *     tags: [Product]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllProducts'
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
productRouter.post('/GetAll', authMiddleware,checkPermission("PRODUCT_LIST", "view"), getAllProducts);

/**
 * @swagger
 * /api/Product/GetById:
 *   post:
 *     summary: Get product by Id
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns Product object
 *       400:
 *         description: Invalid product id
 *       404:
 *         description: Product not found
 */

productRouter.post('/GetById', authMiddleware,checkPermission("PRODUCT_LIST", "view"), getProductById);

/**
  * @swagger
  * /api/Product/Delete:
  *   post:
  *     summary: Delete product
  *     tags: [Product]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteProduct'
  *     responses:
  *       200:
  *         description: Product deleted successfully.
  */
productRouter.put('/Delete', authMiddleware,checkPermission("PRODUCT_LIST", "delete"), deleteProduct);

/**
  * @swagger
  * /api/Product/getProductByCategoryId/{categoryId}:
  *   get:
  *     summary: Get product by Category Id
  *     tags: [Product]
  *     parameters:
  *       - in: path
  *         name: categoryId
  *         required: true
  *         description: Category Id
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Returns Product object.
  */
productRouter.get('/GetProductByCategoryId/:categoryId', authMiddleware,checkPermission("PRODUCT_LIST", "view"), getProductByCategoryId);

/**
 * @swagger
 * /api/Product/GetProducts:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Returns list of products
 */
productRouter.get('/GetProducts', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getProducts);

module.exports = productRouter;