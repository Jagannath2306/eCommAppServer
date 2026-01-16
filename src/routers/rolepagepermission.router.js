const express = require('express');
const rolePermissionRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveRolePermission, updateRolePermission, getAllRolePermission, getRolePermissionById, deleteRolePermission, getPermissions, saveAndUpdatePermissions } = require('../controllers/rolepagepermission.controller');
const checkPermission = require('../middlewares/role.auth.middleware');

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
rolePermissionRouter.post('/Save', authMiddleware, checkPermission('PERMISSION_LIST', 'create'), saveRolePermission);


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
rolePermissionRouter.post('/Update', authMiddleware, checkPermission('PERMISSION_LIST', 'edit'), updateRolePermission);

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
rolePermissionRouter.post('/GetAll', authMiddleware, checkPermission('PERMISSION_LIST', 'view'), getAllRolePermission);

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
rolePermissionRouter.post('/GetById', authMiddleware, checkPermission('PERMISSION_LIST', 'view'), getRolePermissionById);

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
rolePermissionRouter.post('/Delete', authMiddleware, checkPermission('PERMISSION_LIST', 'delete'), deleteRolePermission);

/**
* @swagger
* /api/RolePermission/GetPermissions:
*   get:
*     summary: Get GetPermissions for logged-in user
*     tags: [RolePermission]
*     responses:
*       200:
*         description: GetPermissions fetched successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*       401:
*         description: Unauthorized
*       403:
*         description: Forbidden
*/
rolePermissionRouter.get('/GetPermissions', authMiddleware, getPermissions);

/**
 * @swagger
 * /api/RolePermission/SaveAndUpdatePermissions:
 *   post:
 *     summary: Save And Update Permissions
 *     tags: [RolePermission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveAndUpdatePermissions'
 *     responses:
 *       200:
 *         description: Save And Update Permissions successfully.
 */
rolePermissionRouter.post('/SaveAndUpdatePermissions', authMiddleware, checkPermission('PERMISSION_LIST', 'edit'), saveAndUpdatePermissions);

module.exports = rolePermissionRouter;