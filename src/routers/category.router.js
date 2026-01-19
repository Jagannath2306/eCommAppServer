const express = require('express');
const categoryRouter = express.Router();
const { adminAuthMiddleware, authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveCategory, updateCategory, deleteCategory, getCategoryById, getAllCategories, getCategories } = require('../controllers/category.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : Category
 * description : API for managing Categories 
 */

/**
 * @swagger
 * /api/Category/Save:
 *   post:
 *     summary: Save new Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/InsertCategory'
 *     responses:
 *       201:
 *         description: Category saved successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
categoryRouter.post('/Save', authMiddleware, checkPermission("PRODUCT_LIST", "create"), saveCategory);

/**
 * @swagger
 * /api/Category/Update:
 *   post:
 *     summary: Update Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       201:
 *         description: Category updated successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
categoryRouter.post('/Update', authMiddleware, checkPermission("PRODUCT_LIST", "edit"), updateCategory);

/**
  * @swagger
  * /api/Category/GetAll:
  *   post:
  *     summary: Get All Categories
  *     tags: [Category]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllCategories'
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
categoryRouter.post('/GetAll', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getAllCategories);

/**
  * @swagger
  * /api/Category/GetById/{id}:
  *   get:
  *     summary: Get category by Id
  *     tags: [Category]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: Category Id
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Returns Category object.
  */
categoryRouter.get('/GetById/:id', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getCategoryById);

/**
 * @swagger
 * /api/Category/GetCategories:
 *   get:
 *     tags: [Category]
 *     summary: Get all categories
 *     description: Returns all categories
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

categoryRouter.get('/GetCategories', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getCategories);

/**
  * @swagger
  * /api/Category/Delete:
  *   post:
  *     summary: Delete category
  *     tags: [Category]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteCategory'
  *     responses:
  *       200:
  *         description: Category deleted successfully.
  */
categoryRouter.post('/Delete', authMiddleware, checkPermission("PRODUCT_LIST", "delete"), deleteCategory);


module.exports = categoryRouter;