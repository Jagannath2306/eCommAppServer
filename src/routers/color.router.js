const express = require('express');
const colorRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveColor, updateColor, deleteColor, getColorById, getAllColors, getColorList } = require('../controllers/color.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : Color
 * description : API for managing Colors 
 */



/**
 * @swagger
 * /api/Color/Save:
 *   post:
 *     summary: Insert New Color
 *     tags: [Color]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertColor'
 *     responses:
 *       201:
 *         description: Color Saved Successfully
 */
colorRouter.post('/Save', authMiddleware, checkPermission("COLOR_LIST", "create"), saveColor);


/**
  * @swagger
  * /api/Color/Update:
  *   post:
  *     summary: Update color
  *     tags: [Color]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateColor'
  *     responses:
  *       201:
  *         description: Color updated successfully.
  */
colorRouter.post('/Update', authMiddleware, checkPermission("COLOR_LIST", "edit"), updateColor);


/**
  * @swagger
  * /api/Color/GetAll:
  *   post:
  *     summary: Get All Colors
  *     tags: [Color]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllColors'
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
colorRouter.post('/GetAll', authMiddleware, checkPermission("COLOR_LIST", "view"), getAllColors);

/**
 * @swagger
 * /api/Color/GetById:
 *   post:
 *     summary: Get color by Id
 *     tags: [Color]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Color Id
 *     responses:
 *       200:
 *         description: Returns Color object.
 */
colorRouter.post('/GetById', authMiddleware, checkPermission("COLOR_LIST", "view"), getColorById);

/**
  * @swagger
  * /api/Color/Delete:
  *   post:
  *     summary: Delete color
  *     tags: [Color]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteColor'
  *     responses:
  *       200:
  *         description: Color deleted successfully.
  */
colorRouter.put('/Delete', authMiddleware, checkPermission("COLOR_LIST", "delete"), deleteColor);


/**
  * @swagger
  * /api/Color/GetColorList:
  *   post:
  *     summary: Get All Colors
  *     tags: [Color]
  *     responses:
  *       200:
  *         description: Success
  */
colorRouter.get('/GetColorList', authMiddleware, checkPermission("COLOR_LIST", "view"), getColorList);


module.exports = colorRouter;