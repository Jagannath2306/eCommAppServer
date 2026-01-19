const express = require('express');
const colorRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveColor, updateColor, deleteColor, getColorById, getAllColors } = require('../controllers/color.controller');
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
colorRouter.post('/Save', authMiddleware, checkPermission("PRODUCT_LIST", "create"), saveColor);


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
colorRouter.post('/Update', authMiddleware, checkPermission("PRODUCT_LIST", "edit"), updateColor);
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
colorRouter.post('/GetAll', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getAllColors);

/**
  * @swagger
  * /api/Color/GetById/{id}:
  *   get:
  *     summary: Get color by Id
  *     tags: [Color]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: Color Id
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Returns Color object.
  */
colorRouter.get('/GetById/:id', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getColorById);

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
colorRouter.post('/Delete', authMiddleware, checkPermission("PRODUCT_LIST", "delete"), deleteColor);


module.exports = colorRouter;