const { BillingDetail, PurchaseItem, BillMaster, PaymentMaster, OnlinePaymentMaster, CancelOrder } = require('../models/payment.model');
const Joi = require('joi');
const mongoose = require('mongoose');

const PAYMENT_STATUS_MAP = {
    PENDING: {
        paymentStatusId: "6955512c4057097e4e69b57e",
        orderStatusId: "695552544057097e4e69b5a4"
    },
    SUCCESS: {
        paymentStatusId: "695551424057097e4e69b581",
        orderStatusId: "695552604057097e4e69b5a7"
    },
    FAILED: {
        paymentStatusId: "6955514e4057097e4e69b584",
        orderStatusId: "695552b54057097e4e69b5c2"
    },
    CANCELLED: {
        paymentStatusId: "6955515a4057097e4e69b587",
        orderStatusId: "6955528e4057097e4e69b5b6"
    },
    REFUNDED: {
        paymentStatusId: "695551684057097e4e69b58a",
        orderStatusId: "695552a64057097e4e69b5bc"
    }
};


function validateBillingDetails(details) {
    const schema = Joi.object({
        addressId: Joi.string().length(24).required(),

        subTotalAmount: Joi.number().positive().required(),

        shippingAmount: Joi.number().min(0).required(),

        totalAmount: Joi.number().positive().required(),

        paymentTypeId: Joi.string().length(24).required(),

        items: Joi.array().min(1).required(),

        payment: Joi.object({
            tokenId: Joi.string().required(),
            amount: Joi.number().positive().required(),
            description: Joi.string().allow('', null)
        }).required()
    });

    return schema.validate(details, { abortEarly: true });
}


function validatePurchaseItems(item) {
    const schema = Joi.object({
        productId: Joi.string().length(24).required(),
        sizeId: Joi.string().length(24).required(),
        colorId: Joi.string().length(24).required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
        discount: Joi.number().min(0).default(0)
    });

    return schema.validate(item, { abortEarly: true });
}

function generateInvoiceNo() {
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INV-${ymd}-${rand}`;
}


const savePaymentMaster = async (req, res) => {
    try {
        const loggedInUser = req.session.customer;

        if (!loggedInUser) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // 1️⃣ Validate Billing Details
        const billingResult = validateBillingDetails(req.body);
        if (billingResult.error) {
            return res.status(400).json({
                success: false,
                message: billingResult.error.details[0].message
            });
        }

        const { items } = req.body;

        // 2️⃣ Validate Items
        for (const item of items) {
            const itemResult = validatePurchaseItems(item);
            if (itemResult.error) {
                return res.status(400).json({
                    success: false,
                    message: itemResult.error.details[0].message
                });
            }
        }

        // 3️⃣ Save Billing Details
        const resBillingDetails = await new BillingDetail({
            customerId: loggedInUser.id,
            addressId: req.body.addressId,
            createdBy: loggedInUser.id
        }).save();

        // 4️⃣ Save Purchase Items + Bill Master
        for (const item of items) {
            const resPurchaseItem = await new PurchaseItem({
                ...item,
                discount: item.discount || 0,
                createdBy: loggedInUser.id
            }).save();

            await new BillMaster({
                billingDetailsId: resBillingDetails._id,
                purchaseItemId: resPurchaseItem._id,
                createdBy: loggedInUser.id
            }).save();
        }

        // 5️⃣ Mock Payment Gateway Response
        const payRes = {
            status: 'PENDING',
            cvc_check: 'pass',
            email: 'ajeet@gmail.com',
            country: 'India',
            brand: 'Visa',
            exp_month: '12',
            exp_year: '2030'
        };

        const statusData = PAYMENT_STATUS_MAP[payRes.status];
        if (!statusData) {
            return res.status(400).json({ success: false, message: "Invalid payment status" });
        }

        // 6️⃣ Save Payment Master
        const resPaymentMaster = await new PaymentMaster({
            billingDetailsId: resBillingDetails._id,
            subTotalAmount: req.body.subTotalAmount,
            shippingAmount: req.body.shippingAmount,
            totalAmount: req.body.totalAmount,
            paymentTypeId: req.body.paymentTypeId,
            paymentStatusId: statusData.paymentStatusId,
            orderStatusId: statusData.orderStatusId,
            invoiceNo: generateInvoiceNo(),
            createdBy: loggedInUser.id
        }).save();

        // 7️⃣ Save Online Payment Master
        await new OnlinePaymentMaster({
            paymentId: resPaymentMaster._id,
            tokenId: req.body.payment.tokenId,
            transactionId: req.body.payment.tokenId,
            country: payRes.country,
            brand: payRes.brand,
            exp_month: payRes.exp_month,
            exp_year: payRes.exp_year,
            cvc_check: payRes.cvc_check,
            email: payRes.email,
            status: payRes.status,
            description: req.body.payment.description,
            amount: req.body.payment.amount,
            createdBy: loggedInUser.id
        }).save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Order processing failed",
            error: error.message
        });
    }
};

const getOrders = async (req, res) => {
    const loggedInUser = req.session.customer;

    if (!loggedInUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await BillMaster.aggregate([
        {
            $lookup: {
                from: 'purchaseitems',
                localField: 'purchaseItemId',
                foreignField: '_id',
                as: 'PurchaseItems'
            }
        }, { $unwind: '$PurchaseItems' },
        {
            $lookup: {
                from: 'products',
                localField: 'PurchaseItems.productId',
                foreignField: '_id',
                as: 'Product'
            }
        }, { $unwind: '$Product' },
        {
            $lookup: {
                from: 'sizes',
                localField: 'PurchaseItems.sizeId',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, name: 1 } }],
                as: 'Size'
            }
        }, { $unwind: '$Size' },
        {
            $lookup: {
                from: 'colors',
                localField: 'PurchaseItems.colorId',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, name: 1, code: 1 } }],
                as: 'Color'
            }
        }, { $unwind: '$Color' },
        {
            $lookup: {
                from: 'tags',
                localField: 'Product.tagId',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, name: 1 } }],
                as: 'Tag'
            }
        }, { $unwind: '$Tag' },
        // {
        //     $lookup: {
        //         from: 'categories',
        //         localField: 'Product.categoryId',
        //         foreignField: '_id',
        //         as: 'Category'
        //     }
        // }, { $unwind: '$Category' },
        {
            $lookup: {
                from: 'categories',
                let: { categoryId: '$Product.categoryId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$categoryId'] }
                        }
                    },
                    { $project: { _id: 1, name: 1, title: 1 } }
                ],
                as: 'Category'
            }
        }, { $unwind: '$Category' },
        {
            $lookup: {
                from: 'billingdetails',
                let: { billingDetailsId: '$billingDetailsId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$billingDetailsId'] }
                        }
                    },
                    { $match: { customerId: new mongoose.Types.ObjectId(String(loggedInUser.id)) } },
                    { $project: { _id: 1, customerId: 1, addressId: 1 } }
                ],
                as: 'BillingDetails'
            }
        }, { $unwind: '$BillingDetails' },
        {
            $lookup: {
                from: 'paymentmasters',
                let: { billingDetailId: '$BillingDetails._id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$billingDetailsId', '$$billingDetailId'] }
                        }
                    },
                    { $project: { _id: 1, billingDetailsId: 1, invoiceNo: 1, subTotalAmount: 1, shippingAmount: 1, totalAmount: 1, paymentTypeId: 1, paymentStatusId: 1, orderStatusId: 1 } }
                ],
                as: 'PaymentMaster'
            }
        }, { $unwind: '$PaymentMaster' },
        {
            $lookup: {
                from: 'paymenttypes',
                localField: 'PaymentMaster.paymentTypeId',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, name: 1 } }],
                as: 'PaymentType'
            }
        }, { $unwind: '$PaymentType' },
        {
            $lookup: {
                from: 'paymentstatuses',
                localField: 'PaymentMaster.paymentStatusId',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, name: 1 } }],
                as: 'PaymentStatus'
            }
        }, { $unwind: '$PaymentStatus' },
        {
            $lookup: {
                from: 'orderstatuses',
                localField: 'PaymentMaster.orderStatusId',
                foreignField: '_id',
                pipeline: [{ $project: { _id: 1, name: 1 } }],
                as: 'OrderStatus'
            }
        }, { $unwind: '$OrderStatus' },
        {
            $lookup: {
                from: 'customeraddresses',
                let: { addressId: '$BillingDetails.addressId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$addressId'] }
                        }
                    },
                    { $project: { _id: 1, firstName: 1, lastName: 1, phone: 1, country: 1, state: 1, city: 1, zipcode: 1, address: 1, landmark: 1 } }
                ],
                as: 'CustomerAddress'
            }
        }, { $unwind: '$CustomerAddress' },
        {
            $lookup: {
                from: 'customermasters',
                let: { customerId: '$BillingDetails.customerId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$customerId'] }
                        }
                    },
                    { $project: { _id: 1, firstName: 1, lastName: 1, phone: 1, email: 1 } }
                ],
                as: 'Customer'
            }
        }, { $unwind: '$Customer' },
    ]);

    return res.status(200).json({ success: true, data: orders });
};

const cancelOrder = async (req, res) => {
    const loggedInUser = req.session.customer;

    if (!loggedInUser) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const schema = Joi.object({
        paymentId: Joi.string().required(),
        cancelReason: Joi.string().required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).json({
            success: false,
            message: result.error.details[0].message
        });
    }
    const { paymentId, cancelReason } = result.value;

    const isCancelled = await PaymentMaster.findOneAndUpdate({ _id: paymentId }, { $set: { orderStatusId: "6955528e4057097e4e69b5b6", paymentStatusId: "695551684057097e4e69b58a" } });
    if (!isCancelled) {
        return res.status(404).json({ success: false, message: "Payment record not found" });
    }
    const cancelorder = await new CancelOrder({
        paymentId: paymentId,
        cancelReason: cancelReason,
        createdBy: loggedInUser.id
    }).save();
    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
};

module.exports = { savePaymentMaster, getOrders, cancelOrder };