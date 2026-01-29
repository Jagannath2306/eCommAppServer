const express = require('express');
const variantstatusmasterRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveVariantStatusMaster, updateVariantStatusMaster, getAllVariantStatusMaster, getVariantStatusMasterById, deleteVariantStatusMaster, getVariantStatusList } = require('../controllers/variantstatusmaster.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : VariantStatusMaster
 * description : API for managing VariantStatusMaster 
 */



/**
 * @swagger
 * /api/VariantStatusMaster/Save:
 *   post:
 *     summary: Insert New VariantStatusMaster
 *     tags: [VariantStatusMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertVariantStatusMaster'
 *     responses:
 *       201:
 *         description: VariantStatusMaster Saved Successfully
 */
variantstatusmasterRouter.post('/Save', authMiddleware, checkPermission("VARIANT_LIST", "create"), saveVariantStatusMaster);



/**
  * @swagger
  * /api/VariantStatusMaster/Update:
  *   post:
  *     summary: Update VariantStatusMaster
  *     tags: [VariantStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateVariantStatusMaster'
  *     responses:
  *       201:
  *         description: VariantStatusMaster updated successfully.
  */
variantstatusmasterRouter.post('/Update', authMiddleware, checkPermission("VARIANT_STATUS_LIST", "edit"), updateVariantStatusMaster);

/**
  * @swagger
  * /api/VariantStatusMaster/GetAll:
  *   post:
  *     summary: Get All VariantStatusMaster
  *     tags: [VariantStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllVariantStatusMaster'
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
variantstatusmasterRouter.post('/GetAll', authMiddleware, checkPermission("VARIANT_STATUS_LIST", "view"), getAllVariantStatusMaster);

/**
  * @swagger
  * /api/VariantStatusMaster/GetById:
  *   post:
  *     summary: Get VariantStatusMaster by Id
  *     tags: [VariantStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetVariantStatusMasterById'
  *     responses:
  *       200:
  *         description: VariantStatusMaster fetched successfully.
  */
variantstatusmasterRouter.post('/GetById', authMiddleware, checkPermission("VARIANT_STATUS_LIST", "view"), getVariantStatusMasterById);

/**
  * @swagger
  * /api/VariantStatusMaster/Delete:
  *   post:
  *     summary: Delete VariantStatusMaster
  *     tags: [VariantStatusMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteVariantStatusMaster'
  *     responses:
  *       200:
  *         description: VariantStatusMaster deleted successfully.
  */
variantstatusmasterRouter.put('/Delete', authMiddleware, checkPermission("VARIANT_STATUS_LIST", "delete"), deleteVariantStatusMaster);

/**
  * @swagger
  * /api/VariantStatusMaster/GetVariantStatusList:
  *   get:
  *     summary: Get All Status
  *     tags: [VariantStatusMaster]
  *     responses:
  *       200:
  *         description: Success
  */
variantstatusmasterRouter.get('/GetVariantStatusList', authMiddleware, checkPermission("VARIANT_STATUS_LIST", "view"), getVariantStatusList);

module.exports = variantstatusmasterRouter;