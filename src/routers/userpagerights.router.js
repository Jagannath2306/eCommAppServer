const express = require('express');
const userpagerightsRouter = express.Router();
const { adminAuthMiddleware, authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveUserPageRights, updateUserPageRights, getAllUserPageRights, getUserPageRightsById, getPageRightsByUserAndModule, getPageRightsByUser , updateMenuConfig, getMenusByUser, getSidebarMenu } = require('../controllers/userpagerights.controller');


/**
 * @swagger
 * tags:
 *  name : UserPageRights
 * description : API for managing UserPageRights
 */


/**
  * @swagger
  * /api/UserPageRights/Save:
  *   post:
  *     summary: Save new UserPageRights
  *     tags: [UserPageRights]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/InsertUserPageRights'
  *     responses:
  *       200:
  *         description: UserPageRights saved successfully.
  */
userpagerightsRouter.post('/Save', adminAuthMiddleware, saveUserPageRights);


/**
  * @swagger
  * /api/UserPageRights/Update:
  *   post:
  *     summary: Update UserPageRights
  *     tags: [UserPageRights]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateUserPageRights'
  *     responses:
  *       200:
  *         description: UserPageRights updated successfully.
  */
userpagerightsRouter.post('/Update', adminAuthMiddleware, updateUserPageRights);

/**
  * @swagger
  * /api/UserPageRights/GetAll:
  *   post:
  *     summary: Get All UserPageRights
  *     tags: [UserPageRights]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllUserPageRights'
  *     responses:
  *       200:
  *         description: Successfully fetched all UserPageRights.
  */
userpagerightsRouter.post('/GetAll', adminAuthMiddleware, getAllUserPageRights);

/**
  * @swagger
  * /api/UserPageRights/GetById:
  *   post:
  *     summary: Get UserPageRights by Id
  *     tags: [UserPageRights]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetUserPageRightsById'
  *     responses:
  *       200:
  *         description: UserPageRights fetched successfully.
  */
userpagerightsRouter.post('/GetById', adminAuthMiddleware, getUserPageRightsById);

 /**
    * @swagger
    * /api/UserPageRights/GetByUserIdAndModuleId:
    *   post:
    *     summary: Get UserPageRights by Id
    *     tags: [UserPageRights]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/GetPageRightsByUserAndModule'
    *     responses:
    *       200:
    *         description: UserPageRights fetched successfully.
    */
  userpagerightsRouter.post('/GetByUserIdAndModuleId', adminAuthMiddleware, getPageRightsByUserAndModule);

/**
    * @swagger
    * /api/UserPageRights/GetByUserId:
    *   post:
    *     summary: Get UserPageRights User Email
    *     tags: [UserPageRights]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/GetPageRightsByUser'
    *     responses:
    *       200:
    *         description: UserPageRights fetched successfully.
    */
  userpagerightsRouter.post('/GetByUserId', adminAuthMiddleware, getPageRightsByUser);

/**
    * @swagger
    * /api/UserPageRights/UpdateMenuConfig:
    *   post:
    *     summary: Update Menu Configuration (Setting Menus Ranks)
    *     tags: [UserPageRights]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/UpdateMenuConfig'
    *     responses:
    *       200:
    *         description: UserPageRights fetched successfully.
    */
  userpagerightsRouter.post('/UpdateMenuConfig', adminAuthMiddleware, updateMenuConfig);


  /**
 * @swagger
 * /api/UserPageRights/GetMenusByUser:
 *   get:
 *     summary: Get sidebar menus for logged-in user
 *     tags: [UserPageRights]
 *     responses:
 *       200:
 *         description: Sidebar menus fetched successfully
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
userpagerightsRouter.get('/GetMenusByUser', authMiddleware, getSidebarMenu);


module.exports = userpagerightsRouter;