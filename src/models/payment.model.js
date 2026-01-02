const mongoose = require("mongoose");

const BillingDetailsSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customermaster',
        required: true,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customeraddress',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "usermaster",
        required: true,
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: "usermaster",
    },
},
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn",
        },
    }
);

const PurchaseItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    sizeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'size',
        required: true,
    },
    colorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'color',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "usermaster",
        required: true,
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: "usermaster",
    },
},
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn",
        },
    }
);

const BillMasterSchema = new mongoose.Schema({
    purchaseItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchaseitem',
        required: true,
    },
    billingDetailsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'billingdetail',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "usermaster",
        required: true,
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: "usermaster",
    },
},
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn",
        },
    }
);


const PaymentMasterSchema = new mongoose.Schema(
    {
        billingDetailsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'billingdetail',
            required: true,
        },
        subTotalAmount: {
            type: Number,
            required: true,
        },
        shippingAmount: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'paymenttype',
            required: true,
        },
        paymentStatusId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'paymentstatus',
            required: true,
        },
        orderStatusId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orderstatus',
            required: true
        },
        invoiceNo: {
            type: String,
            required: true,
            unique: true
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "usermaster",
            required: true,
        },
        modifiedBy: {
            type: mongoose.Types.ObjectId,
            ref: "usermaster",
        },
    },
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn",
        },
    }
);

const OnlinePaymentMasterSchema = new mongoose.Schema(
    {
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'paymentmaster',
            required: true,
        },
        tokenId: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        exp_month: {
            type: String,
            required: true,
        },
        exp_year: {
            type: String,
            required: true,
        },
        cvc_check: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "usermaster",
            required: true,
        },
        modifiedBy: {
            type: mongoose.Types.ObjectId,
            ref: "usermaster",
        },
    },
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn",
        },
    }
);
const CancelOrderSchema = new mongoose.Schema({
    billMasterId: {
        type: mongoose.Types.ObjectId,
        ref: "billmaster",
        required: true
    },
    cancelReason: {
        type: String,
        required: true
    },
    cancelDate: {
        type: String,
        default: new Date(),
        required: true
    }
}
);


const BillingDetail = mongoose.model("billingdetail", BillingDetailsSchema);
const PurchaseItem = mongoose.model("purchaseitem", PurchaseItemSchema);
const BillMaster = mongoose.model("billmaster", BillMasterSchema);
const PaymentMaster = mongoose.model("paymentmaster", PaymentMasterSchema);
const OnlinePaymentMaster = mongoose.model("onlinepaymentmaster", OnlinePaymentMasterSchema);
const CancelOrder = mongoose.model('cancelorder', CancelOrderSchema);

module.exports = {
    BillingDetail,
    PurchaseItem,
    BillMaster,
    PaymentMaster,
    OnlinePaymentMaster,
    CancelOrder
};
