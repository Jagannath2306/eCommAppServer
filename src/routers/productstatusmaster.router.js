const express = require('express');
const productstatusmasterRouter = express.Router();
const { adminAuthMiddleware, authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveProductStatusMaster, updateProductStatusMaster, getAllProductStatusMaster, getProductStatusMasterById, deleteProductStatusMaster, getStatusList } = require('../controllers/productstatusmaster.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : ProductStatusMaster
 * description : API for managing ProductStatusMaster 
 */



/**
 * @swagger
 * /api/ProductStatusMaster/Save:
 *   post:
 *     summary: Insert New ProductStatusMaster
 *     tags: [ProductStatusMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertProductStatusMaster'
 *     responses:
 *       201:
 *         description: ProductStatusMaster Saved Successfully
 */
productstatusmasterRouter.post('/Save', authMiddleware, checkPermission("STATUS_LIST", "create"), saveProductStatusMaster);



/**
  * @swagger
  * /api/ProductStatusMaster/Update:
  *   post:
  *     summary: Update ProductStatusMaster
  *     tags: [ProductStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateProductStatusMaster'
  *     responses:
  *       201:
  *         description: ProductStatusMaster updated successfully.
  */
productstatusmasterRouter.post('/Update', authMiddleware, checkPermission("STATUS_LIST", "edit"), updateProductStatusMaster);

/**
  * @swagger
  * /api/ProductStatusMaster/GetAll:
  *   post:
  *     summary: Get All ProductStatusMaster
  *     tags: [ProductStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllProductStatusMaster'
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
productstatusmasterRouter.post('/GetAll', authMiddleware, checkPermission("STATUS_LIST", "view"), getAllProductStatusMaster);

/**
  * @swagger
  * /api/ProductStatusMaster/GetById:
  *   post:
  *     summary: Get ProductStatusMaster by Id
  *     tags: [ProductStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetProductStatusMasterById'
  *     responses:
  *       200:
  *         description: ProductStatusMaster fetched successfully.
  */
productstatusmasterRouter.post('/GetById', authMiddleware, checkPermission("STATUS_LIST", "view"), getProductStatusMasterById);

/**
  * @swagger
  * /api/ProductStatusMaster/Delete:
  *   post:
  *     summary: Delete ProductStatusMaster
  *     tags: [ProductStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteProductStatusMaster'
  *     responses:
  *       200:
  *         description: ProductStatusMaster deleted successfully.
  */
productstatusmasterRouter.put('/Delete', authMiddleware, checkPermission("STATUS_LIST", "delete"), deleteProductStatusMaster);

/**
  * @swagger
  * /api/ProductStatusMaster/GetStatusList:
  *   get:
  *     summary: Get All Status
  *     tags: [ProductStatusMaster]
  *     responses:
  *       200:
  *         description: Success
  */
productstatusmasterRouter.get('/GetStatusList', authMiddleware, checkPermission("VARIANT_LIST", "view"), getStatusList);
module.exports = productstatusmasterRouter;