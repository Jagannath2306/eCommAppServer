const express = require('express');
const rolePermissionRouter = express.Router();
const { adminAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { saveRolePermission, updateRolePermission, getAllRolePermission, getRolePermissionById, deleteRolePermission } = require('../controllers/rolepagepermission.controller');


/**
 * @swagger
 * tags:
 *  name : RolePermission
 * description : API for managing Role Permission
 */


/**
  * @swagger
  * /api/RolePermission/Save:
  *   post:
  *     summary: Save new Role Permission
  *     tags: [RolePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/InsertRolePermission'
  *     responses:
  *       200:
  *         description: Role Permission saved successfully.
  */
rolePermissionRouter.post('/Save', adminAuthMiddleware, saveRolePermission);


/**
  * @swagger
  * /api/RolePermission/Update:
  *   post:
  *     summary: Update Role Permission
  *     tags: [RolePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateRolePermission'
  *     responses:
  *       200:
  *         description: Role Permission updated successfully.
  */
rolePermissionRouter.post('/Update', adminAuthMiddleware, updateRolePermission);

/**
  * @swagger
  * /api/RolePermission/GetAll:
  *   post:
  *     summary: Get All Role Permission
  *     tags: [RolePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllRolePermission'
  *     responses:
  *       200:
  *         description: Successfully fetched all Role Permission.
  */
rolePermissionRouter.post('/GetAll', adminAuthMiddleware, getAllRolePermission);

/**
  * @swagger
  * /api/RolePermission/GetById:
  *   post:
  *     summary: Get Role Permission by Id
  *     tags: [RolePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetRolePermissionById'
  *     responses:
  *       200:
  *         description: Role Permission fetched successfully.
  */
rolePermissionRouter.post('/GetById', adminAuthMiddleware, getRolePermissionById);

/**
  * @swagger
  * /api/RolePermission/Delete:
  *   post:
  *     summary: Delete Page Permission
  *     tags: [RolePermission]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteRolePermission'
  *     responses:
  *       200:
  *         description: Role Permission deleted successfully.
  */
rolePermissionRouter.post('/Delete', adminAuthMiddleware, deleteRolePermission);


module.exports = rolePermissionRouter;