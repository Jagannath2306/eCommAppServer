const express = require('express');
const sizeRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveSize, updateSize, deleteSize, getSizeById, getAllSize, getSizeList } = require('../controllers/size.controller');
const checkPermission = require('../middlewares/role.auth.middleware');

/**
 * @swagger
 * tags:
 *  name : Size
 * description : API for managing Sizes 
 */


/**
 * @swagger
 * /api/Size/Save:
 *   post:
 *     summary: Insert New Size
 *     tags: [Size]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertSize'
 *     responses:
 *       201:
 *         description: Size Saved Successfully
 */
sizeRouter.post('/Save', authMiddleware, checkPermission("SIZE_LIST", "create"), saveSize);


/**
  * @swagger
  * /api/Size/Update:
  *   post:
  *     summary: Update size
  *     tags: [Size]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateSize'
  *     responses:
  *       201:
  *         description: Size updated successfully.
  */
sizeRouter.post('/Update', authMiddleware, checkPermission("SIZE_LIST", "edit"), updateSize);


/**
  * @swagger
  * /api/Size/GetAll:
  *   post:
  *     summary: Get All Sizes
  *     tags: [Size]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllSizes'
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
sizeRouter.post('/GetAll', authMiddleware, checkPermission("SIZE_LIST", "view"), getAllSize);

/**
 * @swagger
 * /api/Size/GetById:
 *   post:
 *     summary: Get size by Id
 *     tags: [Size]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Size Id
 *     responses:
 *       200:
 *         description: Returns Size object.
 */

sizeRouter.post('/GetById', authMiddleware, checkPermission("SIZE_LIST", "view"), getSizeById);
/**
  * @swagger
  * /api/Size/Delete:
  *   post:
  *     summary: Delete size
  *     tags: [Size]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteSize'
  *     responses:
  *       200:
  *         description: Size deleted successfully.
  */
sizeRouter.put('/Delete', authMiddleware, checkPermission("SIZE_LIST", "delete"), deleteSize);

/**
  * @swagger
  * /api/Size/GetSizeList:
  *   get:
  *     summary: Get All Sizes
  *     tags: [Size]
  *     responses:
  *       200:
  *         description: Success
  */
sizeRouter.get('/GetSizeList', authMiddleware, checkPermission("SIZE_LIST", "view"), getSizeList);
module.exports = sizeRouter;