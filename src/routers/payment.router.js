const express = require("express");
const paymentRouter = express.Router();

const { customerAuthMiddleware } = require("../middlewares/user.auth.middleware");

const {
  createPayment,
  paymentWebhook,
  getPaymentById
} = require("../controllers/payment.controller");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment APIs
 */


/**
 * @swagger
 * /api/payment/createPayment:
 *   post:
 *     summary: Create Payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavePayment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
paymentRouter.post("/createPayment",customerAuthMiddleware, createPayment);


/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Payment Gateway Webhook
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentWebhook'
 *     responses:
 *       200:
 *         description: Webhook processed
 */
paymentRouter.post("/webhook",paymentWebhook);


/**
 * @swagger
 * /api/payment/getPaymentById:
 *   post:
 *     summary: Get Payment By Id
 *     tags: [Payments]
 */
paymentRouter.post("/getPaymentById",customerAuthMiddleware,getPaymentById
);

module.exports = paymentRouter;