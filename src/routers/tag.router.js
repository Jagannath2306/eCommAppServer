const express = require('express');
const tagRouter = express.Router();
const { authMiddleware } = require('../middlewares/user.auth.middleware');
const { saveTag, updateTag, deleteTag, getTagById, getAllTags, getTags, getTagList } = require('../controllers/tag.controller');
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
tagRouter.post('/Save', authMiddleware, checkPermission("TAG_LIST", "create"), saveTag);


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
tagRouter.post('/Update', authMiddleware, checkPermission("TAG_LIST", "edit"), updateTag);
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
tagRouter.post('/GetAll', authMiddleware, checkPermission("TAG_LIST", "view"), getAllTags);

/**
 * @swagger
 * /api/Tag/GetById:
 *   post:
 *     summary: Get tag by Id
 *     tags: [Tag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Tag Id
 *     responses:
 *       200:
 *         description: Returns Tag object.
 */

tagRouter.post('/GetById', authMiddleware, checkPermission("TAG_LIST", "view"), getTagById);
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
tagRouter.put('/Delete', authMiddleware, checkPermission("TAG_LIST", "delete"), deleteTag);

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

tagRouter.get('/GetTags', authMiddleware, checkPermission("TAG_LIST", "view"), getTags);


/**
 * @swagger
 * /api/Tag/GetTagList:
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

tagRouter.get('/GetTagList', authMiddleware, checkPermission("TAG_LIST", "view"), getTagList);
module.exports = tagRouter;