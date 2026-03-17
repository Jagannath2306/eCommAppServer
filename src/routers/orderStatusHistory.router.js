const express = require('express');
const orderStatusHistoryRouter = express.Router();
const { customerAuthMiddleware, adminAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { 
    saveOrderStatusHistory, updateOrderStatusHistory, deleteOrderStatusHistory, getOrderStatusHistoryById, getAllOrderStatusHistories, getOrderStatusHistoryList
 } = require('../controllers/orderStatusHistory.controller');

/**
 * @swagger
 * tags:
 *  name: OrdersHistory
 *  description: Order Status History APIs
 */

/**
 * @swagger
 * /api/OrderStatusHistory/CreateStatusHistory:
 *   post:
 *     summary: Create Order Status History
 *     tags: [OrdersHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/saveStatusHistory'
 *     responses:
 *       201:
 *         description: Order Created Successfully
 */
orderStatusHistoryRouter.post('/CreateStatusHistory', customerAuthMiddleware, saveOrderStatusHistory);

/**
 * @swagger
 * /api/OrderStatusHistory/GetStatusHistories:
 *   post:
 *     summary: Get Order Status Histories
 *     tags: [OrdersHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/getAllStatusHistories'
 *     responses:
 *       200:
 *         description: Order status histories fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderStatusHistoryRouter.post('/GetStatusHistories', adminAuthMiddleware, getAllOrderStatusHistories);

/**
 * @swagger
 * /api/OrderStatusHistory/GetStatusHistoriesList:
 *   get:
 *     summary: Get Order Status Histories
 *     tags: [OrdersHistory]
 *     responses:
 *       200:
 *         description: Order status histories fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderStatusHistoryRouter.get('/GetStatusHistoriesList', adminAuthMiddleware, getOrderStatusHistoryList);


/**
 * @swagger
 * /api/OrderStatusHistory/getOrderStatusHistoryById:
 *   get:
 *     summary: Get Order Status History
 *     tags: [OrdersHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: User Id
 *     responses:
 *       200:
 *         description: Order status history fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderStatusHistoryRouter.post('/getOrderStatusHistoryById', getOrderStatusHistoryById);


/**
 * @swagger
 * /api/OrderStatusHistory/UpdateOrderStatusHistory:
 *   post:
 *     summary: Update Order Status History
 *     tags: [OrdersHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateStatusHistory'
 *     responses:
 *       200:
 *         description: Statuses fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderStatusHistoryRouter.post('/UpdateOrderStatus', adminAuthMiddleware, updateOrderStatusHistory);

/**
 * @swagger
 * /api/OrderStatusHistory/DeleteOrderStatusHistory:
 *   post:
 *     summary: Delete Order Status History
 *     tags: [OrdersHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/deleteStatusHistory'
 *     responses:
 *       201:
 *         description: Order Status History Deleted Successfully
 */
orderStatusHistoryRouter.post('/DeleteOrderStatusHistory', customerAuthMiddleware, deleteOrderStatusHistory);

module.exports = orderStatusHistoryRouter;