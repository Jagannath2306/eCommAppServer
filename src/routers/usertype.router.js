const express = require('express');
const userTypeRouter = express.Router();
const { adminAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { saveUserType, updateUserType, deleteUserType, getUserTypeById, getAllUserType ,getUserTypes} = require('../controllers/usertype.controller');


/**
 * @swagger
 * tags:
 *  name :  UserType
 * description : API for managing User Types 
 */



/**
 * @swagger
 * /api/UserType/Save:
 *   post:
 *     summary: Insert New User Type
 *     tags: [UserType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertUserType'
 *     responses:
 *       201:
 *         description: User Type Saved Successfully
 */
userTypeRouter.post('/Save', adminAuthMiddleware, saveUserType);



/**
  * @swagger
  * /api/UserType/Update:
  *   post:
  *     summary: Update user type
  *     tags: [UserType]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateUserType'
  *     responses:
  *       201:
  *         description: User type updated successfully.
  */
userTypeRouter.post('/Update', adminAuthMiddleware, updateUserType);

/**
  * @swagger
  * /api/UserType/GetAll:
  *   post:
  *     summary: Get All User Types
  *     tags: [UserType]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllUserType'
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
userTypeRouter.post('/GetAll', adminAuthMiddleware, getAllUserType);

/**
 * @swagger
 * /api/UserType/GetUserTypes:
 *   get:
 *     summary: Get All Users Types without pagination
 *     tags: [UserType]
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
userTypeRouter.get('/GetUserTypes', adminAuthMiddleware, getUserTypes);

/**
  * @swagger
  * /api/UserType/GetById/{id}:
  *   get:
  *     summary: Get user type by Id
  *     tags: [UserType]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: User Type Id
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Returns User type object.
  */
userTypeRouter.get('/GetById/:id', adminAuthMiddleware, getUserTypeById);


/**
  * @swagger
  * /api/UserType/Delete:
  *   post:
  *     summary: Delete user type
  *     tags: [UserType]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteUserType'
  *     responses:
  *       200:
  *         description: User type deleted successfully.
  */
userTypeRouter.post('/Delete', adminAuthMiddleware, deleteUserType);


module.exports =  userTypeRouter;

