const express = require('express');
const pagemasterRouter = express.Router();
const { adminAuthMiddleware, authMiddleware } = require('../middlewares/user.auth.middleware');
const { savePageMaster, updatePageMaster, getAllPageMasters, getPageMasterById, deletePageMaster, getPageByModuleIdBySubModuleIdByUserTypeId } = require('../controllers/pagemaster.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : PageMaster
 * description : API for managing PageMaster
 */


/**
  * @swagger
  * /api/PageMaster/Save:
  *   post:
  *     summary: Save new PageMaster
  *     tags: [PageMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/InsertPageMaster'
  *     responses:
  *       200:
  *         description: PageMaster saved successfully.
  */
pagemasterRouter.post('/Save', authMiddleware,checkPermission("USER_LIST","create"), savePageMaster);


/**
  * @swagger
  * /api/PageMaster/Update:
  *   post:
  *     summary: Update PageMaster
  *     tags: [PageMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdatePageMaster'
  *     responses:
  *       200:
  *         description: PageMaster updated successfully.
  */
pagemasterRouter.post('/Update', authMiddleware,checkPermission("USER_LIST","edit"), updatePageMaster);

/**
  * @swagger
  * /api/PageMaster/GetAll:
  *   post:
  *     summary: Get All PageMaster
  *     tags: [PageMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllPageMasters'
  *     responses:
  *       200:
  *         description: Successfully fetched all PageMasters.
  */
pagemasterRouter.post('/GetAll', authMiddleware,checkPermission("USER_LIST","view"), getAllPageMasters);

/**
  * @swagger
  * /api/PageMaster/GetById:
  *   post:
  *     summary: Get PageMaster by Id
  *     tags: [PageMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetPageMasterById'
  *     responses:
  *       200:
  *         description: PageMaster fetched successfully.
  */
pagemasterRouter.post('/GetById', authMiddleware,checkPermission("USER_LIST","view"), getPageMasterById);

/**
  * @swagger
  * /api/PageMaster/Delete:
  *   post:
  *     summary: Delete PageMaster
  *     tags: [PageMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeletePageMaster'
  *     responses:
  *       200:
  *         description: PageMaster deleted successfully.
  */
pagemasterRouter.post('/Delete', authMiddleware,checkPermission("USER_LIST","delete"), deletePageMaster);


/**
  * @swagger
  * /api/PageMaster/GetPageByModuleIdBySubModuleIdByUserTypeId:
  *   post:
  *     summary: Get GetPageByModuleIdBySubModuleIdByUserType by Ids
  *     tags: [PageMaster]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetPageByModuleIdBySubModuleIdByUserType'
  *     responses:
  *       200:
  *         description: GetPageByModuleIdBySubModuleIdByUserType fetched successfully.
  */
pagemasterRouter.post('/GetPageByModuleIdBySubModuleIdByUserTypeId', authMiddleware,checkPermission("PERMISSION_LIST","view"), getPageByModuleIdBySubModuleIdByUserTypeId);

module.exports = pagemasterRouter;