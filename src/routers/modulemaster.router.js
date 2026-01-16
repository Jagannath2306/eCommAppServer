const express = require('express');
const modulemasterRouter = express.Router();
const { adminAuthMiddleware, authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveModuleMaster, updateModuleMaster, getAllModuleMasters, getModuleMasterById, deleteModuleMaster, getModules } = require('../controllers/modulemaster.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : ModuleMaster
 * description : API for managing ModuleMaster 
 */


/**
 * @swagger
 * /api/ModuleMaster/Save:
 *   post:
 *     summary: Save new ModuleMaster
 *     tags: [ModuleMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveModuleMaster'
 *     responses:
 *       201:
 *         description: ModuleMaster saved successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
modulemasterRouter.post('/Save', adminAuthMiddleware, saveModuleMaster);


/**
 * @swagger
 * /api/ModuleMaster/Update:
 *   post:
 *     summary: Update ModuleMaster
 *     tags: [ModuleMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateModuleMaster'
 *     responses:
 *       201:
 *         description: ModuleMaster updated successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
modulemasterRouter.post('/Update', adminAuthMiddleware, updateModuleMaster);


/**
  * @swagger
  * /api/ModuleMaster/GetAll:
  *   post:
  *     summary: Get All ModuleMaster
  *     tags: [ModuleMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllModuleMaster'
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
modulemasterRouter.post('/GetAll', adminAuthMiddleware, getAllModuleMasters);

/**
  * @swagger
  * /api/ModuleMaster/GetById:
  *   post:
  *     summary: Get ModuleMaster by Id
  *     tags: [ModuleMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetModuleMasterById'
  *     responses:
  *       200:
  *         description: ModuleMaster fetched successfully.
  */
modulemasterRouter.post('/GetById', adminAuthMiddleware, getModuleMasterById);

/**
  * @swagger
  * /api/ModuleMaster/Delete:
  *   post:
  *     summary: Delete ModuleMaster
  *     tags: [ModuleMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteModuleMaster'
  *     responses:
  *       200:
  *         description: ModuleMaster deleted successfully.
  */
modulemasterRouter.post('/Delete', adminAuthMiddleware, deleteModuleMaster);

/**
 * @swagger
 * /api/ModuleMaster/GetModules:
 *   get:
 *     summary: Get All ModuleMaster
 *     tags: [ModuleMaster]
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
modulemasterRouter.get('/GetModules', authMiddleware, checkPermission('PERMISSION_LIST', "view"), getModules);

module.exports = modulemasterRouter;