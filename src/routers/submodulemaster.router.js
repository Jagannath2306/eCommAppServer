const express = require('express');
const submodulemasterRouter = express.Router();
const { adminAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { saveSubModuleMaster, updateSubModuleMaster, getAllSubModuleMasters, getSubModuleMasterById, deleteSubModuleMaster } = require('../controllers/submodulemaster.controller');


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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *                - moduleId
 *                - name
 *                - icon
 *                - defaultActive
 *                - menuRank
 *             properties:
 *               moduleId:
 *                 type: string
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *               defaultActive:
 *                 type: boolean
 *               menuRank:
 *                 type: number
 *     responses:
 *       201:
 *         description: SubModuleMaster saved successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
submodulemasterRouter.post('/Save', adminAuthMiddleware, saveSubModuleMaster);



/**
 * @swagger
 * /api/SubModuleMaster/Update:
 *   post:
 *     summary: Update SubModuleMaster
 *     tags: [SubModuleMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - moduleId
 *               - name
 *               - icon
 *               - defaultActive
 *               - menuRank
 *             properties:
 *               id:
 *                 type: string
 *               moduleId:
 *                 type: string
 *               name:
 *                 type: string
 *               icon:
 *                type: string
 *               defaultActive:
 *                type: boolean
 *               menuRank:
 *                 type: number
 *     responses:
 *       201:
 *         description: SubModuleMaster updated successfully
 *       400:
 *         description: Validation or upload error
 *       401:
 *         description: Unauthorized
 */
submodulemasterRouter.post('/Update', adminAuthMiddleware, updateSubModuleMaster);

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
submodulemasterRouter.post('/GetAll', adminAuthMiddleware, getAllSubModuleMasters);

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
submodulemasterRouter.post('/GetById', adminAuthMiddleware, getSubModuleMasterById);

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
submodulemasterRouter.post('/Delete', adminAuthMiddleware, deleteSubModuleMaster);


module.exports = submodulemasterRouter;