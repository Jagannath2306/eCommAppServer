const express = require('express');
const pagePermissionRouter = express.Router();
const { adminAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { savePagePermission, updatePagePermission , getAllPagePermissionMasters, getPagePermissionMasterById, deletePagePermission } = require('../controllers/pagepermissionmaster.controller');


/**
 * @swagger
 * tags:
 *  name : PagePermission
 * description : API for managing Page Permission
 */


/**
  * @swagger
  * /api/PagePermission/Save:
  *   post:
  *     summary: Save new Page Permission
  *     tags: [PagePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/InsertPagePermission'
  *     responses:
  *       200:
  *         description: Page Permission saved successfully.
  */
pagePermissionRouter.post('/Save', adminAuthMiddleware, savePagePermission);


/**
  * @swagger
  * /api/PagePermission/Update:
  *   post:
  *     summary: Update Page Permission
  *     tags: [PagePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdatePagePermission'
  *     responses:
  *       200:
  *         description: Page Permission updated successfully.
  */
pagePermissionRouter.post('/Update', adminAuthMiddleware, updatePagePermission);

/**
  * @swagger
  * /api/PagePermission/GetAll:
  *   post:
  *     summary: Get All PageMaster
  *     tags: [PagePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllPagePermission'
  *     responses:
  *       200:
  *         description: Successfully fetched all Page Permission.
  */
pagePermissionRouter.post('/GetAll', adminAuthMiddleware, getAllPagePermissionMasters);

/**
  * @swagger
  * /api/PagePermission/GetById:
  *   post:
  *     summary: Get Page Permission by Id
  *     tags: [PagePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetPagePermissionById'
  *     responses:
  *       200:
  *         description: Page Permission fetched successfully.
  */
pagePermissionRouter.post('/GetById', adminAuthMiddleware, getPagePermissionMasterById);

/**
  * @swagger
  * /api/PagePermission/Delete:
  *   post:
  *     summary: Delete Page Permission
  *     tags: [PagePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeletePagePermission'
  *     responses:
  *       200:
  *         description: Page Permission deleted successfully.
  */
pagePermissionRouter.post('/Delete', adminAuthMiddleware, deletePagePermission);


module.exports = pagePermissionRouter;