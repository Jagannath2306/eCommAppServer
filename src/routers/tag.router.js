const express = require('express');
const tagRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveTag, updateTag, deleteTag, getTagById, getAllTags, getTags } = require('../controllers/tag.controller');
const checkPermission = require('../middlewares/role.auth.middleware');


/**
 * @swagger
 * tags:
 *  name : Tag
 * description : API for managing Tags
 */

/**
 * @swagger
 * /api/Tag/Save:
 *   post:
 *     summary: Insert New Tag
 *     tags: [Tag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsertTag'
 *     responses:
 *       201:
 *         description: Tag Saved Successfully
 */
tagRouter.post('/Save', authMiddleware, checkPermission("PRODUCT_LIST", "create"), saveTag);


/**
  * @swagger
  * /api/Tag/Update:
  *   post:
  *     summary: Update tag
  *     tags: [Tag]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateTag'
  *     responses:
  *       201:
  *         description: Tag updated successfully.
  */
tagRouter.post('/Update', authMiddleware, checkPermission("PRODUCT_LIST", "edit"), updateTag);
/**
  * @swagger
  * /api/Tag/GetAll:
  *   post:
  *     summary: Get All Tags
  *     tags: [Tag]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/GetAllTags'
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
tagRouter.post('/GetAll', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getAllTags);

/**
  * @swagger
  * /api/Tag/GetById/{id}:
  *   get:
  *     summary: Get tag by Id
  *     tags: [Tag]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         description: Tag Id
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: Returns Tag object.
  */
tagRouter.get('/GetById/:id', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getTagById);
/**
  * @swagger
  * /api/Tag/Delete:
  *   post:
  *     summary: Delete tag
  *     tags: [Tag]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/DeleteTag'
  *     responses:
  *       200:
  *         description: Tag deleted successfully.
  */
tagRouter.post('/Delete', authMiddleware, checkPermission("PRODUCT_LIST", "delete"), deleteTag);

/**
 * @swagger
 * /api/Tag/GetTags:
 *   get:
 *     tags: [Tag]
 *     summary: Get all tags
 *     description: Returns all tags
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

tagRouter.get('/GetTags', authMiddleware, checkPermission("PRODUCT_LIST", "view"), getTags);
module.exports = tagRouter;