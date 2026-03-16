const express = require('express');
const orderRouter = express.Router();
const { customerAuthMiddleware, adminAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getOrdersList,
  getStatusList,
  updateOrderStatus
 } = require('../controllers/order.controller');

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Customer Order APIs
 */

/**
 * @swagger
 * /api/Order/CreateOrder:
 *   post:
 *     summary: Create Order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveOrder'
 *     responses:
 *       201:
 *         description: Order Created Successfully
 */
orderRouter.post('/CreateOrder', customerAuthMiddleware, createOrder);

/**
 * @swagger
 * /api/Order/GetOrdersList:
 *   get:
 *     summary: Get Orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderRouter.get('/GetOrdersList', adminAuthMiddleware, getOrdersList);


/**
 * @swagger
 * /api/Order/getOrderById:
 *   get:
 *     summary: Get Order
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderRouter.post('/getOrderById', adminAuthMiddleware, getOrderById);

/**
 * @swagger
 * /api/Order/getStatusList:
 *   get:
 *     summary: Get Status List
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Statuses fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderRouter.get('/getStatusList', adminAuthMiddleware, getStatusList);


/**
 * @swagger
 * /api/Order/UpdateOrderStatus:
 *   post:
 *     summary: Update Order Status
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatus'
 *     responses:
 *       200:
 *         description: Statuses fetched successfully
 *       401:
 *         description: Unauthorized
 */
orderRouter.post('/UpdateOrderStatus', adminAuthMiddleware, updateOrderStatus);

/**
 * @swagger
 * /api/Order/cancelOrder:
 *   post:
 *     summary: Cancel Order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/cancelOrder'
 *     responses:
 *       201:
 *         description: Order Cancelled Successfully
 */
orderRouter.post('/cancelOrder', customerAuthMiddleware, cancelOrder);

module.exports = orderRouter;