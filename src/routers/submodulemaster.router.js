const express = require('express');
const submodulemasterRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveSubModuleMaster, updateSubModuleMaster, getAllSubModuleMasters, getSubModuleMasterById, deleteSubModuleMaster, getSubModuleByModuleId } = require('../controllers/submodulemaster.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : SubModuleMaster
 * description : API for managing SubModuleMaster
 */


/**
 * @swagger
 * /api/SubModuleMaster/Save:
 *   post:
 *     summary: Save new SubModuleMaster
 *     tags: [SubModuleMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveSubModuleMaster'
 *     responses:
 *       201:
 *         description: SubModuleMaster saved successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
submodulemasterRouter.post('/Save', authMiddleware, checkPermission('USER_LIST', "create"), saveSubModuleMaster);

/**
 * @swagger
 * /api/SubModuleMaster/Update:
 *   post:
 *     summary: Update SubModuleMaster
 *     tags: [SubModuleMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubModuleMaster'
 *     responses:
 *       201:
 *         description: SubModuleMaster updated successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
submodulemasterRouter.post('/Update', authMiddleware, checkPermission('USER_LIST', "edit"), updateSubModuleMaster);


/**
  * @swagger
  * /api/SubModuleMaster/GetAll:
  *   post:
  *     summary: Get All SubModuleMaster
  *     tags: [SubModuleMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllSubModuleMaster'
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
submodulemasterRouter.post('/GetAll', authMiddleware, checkPermission('USER_LIST', "view"), getAllSubModuleMasters);

/**
  * @swagger
  * /api/SubModuleMaster/GetById:
  *   post:
  *     summary: Get SubModuleMaster by Id
  *     tags: [SubModuleMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetSubModuleMasterById'
  *     responses:
  *       200:
  *         description: SubModuleMaster fetched successfully.
  */
submodulemasterRouter.post('/GetById', authMiddleware, checkPermission('USER_LIST', "view"), getSubModuleMasterById);

/**
  * @swagger
  * /api/SubModuleMaster/Delete:
  *   post:
  *     summary: Delete SubModuleMaster
  *     tags: [SubModuleMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteSubModuleMaster'
  *     responses:
  *       200:
  *         description: SubModuleMaster deleted successfully.
  */
submodulemasterRouter.post('/Delete', authMiddleware, checkPermission('USER_LIST', "delete"), deleteSubModuleMaster);



/**
  * @swagger
  * /api/SubModuleMaster/GetSubModuleByModuleId:
  *   post:
  *     summary: Get Get SubModule By Module Id 
  *     tags: [SubModuleMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetSubModuleByModuleId'
  *     responses:
  *       200:
  *         description: SubModuleMaster fetched successfully.
  */
submodulemasterRouter.post('/GetSubModuleByModuleId', authMiddleware, checkPermission('PERMISSION_LIST', "view"), getSubModuleByModuleId);

module.exports = submodulemasterRouter;