const express = require('express');
const paymentRouter = express.Router();
const { customerAuthMiddleware } = require('../middlewares/user.auth.middleware');
const { savePaymentMaster, getOrders, cancelOrder } = require('../controllers/payment.controller');


/**
 * @swagger
 * tags:
 *  name :  PaymentMaster
 * description : API for managing Payment Master 
 */



/**
 * @swagger
 * /api/Payment/Save:
 *   post:
 *     summary: Save Payment
 *     tags: [PaymentMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavePaymentMaster'
 *     responses:
 *       201:
 *         description: Payment Saved Successfully
 */
paymentRouter.post('/Save', customerAuthMiddleware, savePaymentMaster);

/**
 * @swagger
 * /api/Payment/GetOrders:
 *   get:
 *     summary: Get Orders
 *     tags: [PaymentMaster]
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
paymentRouter.get('/GetOrders', customerAuthMiddleware, getOrders);

/**
 * @swagger
 * /api/Payment/CancelOrder:
 *   post:
 *     summary: Cancel Order
 *     tags: [PaymentMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrder'
 *     responses:
 *       201:
 *         description: Order Cancelled Successfully
 */
paymentRouter.post('/CancelOrder', customerAuthMiddleware, cancelOrder);


module.exports = paymentRouter;
