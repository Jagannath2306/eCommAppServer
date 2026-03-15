module.exports = {
  components: {
    schemas: {

      SavePayment: {
        type: "object",
        required: [
          "orderId",
          "paymentTypeId",
          "amount"
        ],
        properties: {

          orderId: {
            type: "string",
            description: "Order ID"
          },

          paymentTypeId: {
            type: "string",
            description: "Payment Type ID (COD / Online)"
          },

          amount: {
            type: "number",
            description: "Payment amount"
          }

        }
      },

      PaymentWebhook: {
        type: "object",
        required: [
          "paymentId",
          "statusCode",
          "transactionId",
          "gatewayResponse"
        ],
        properties: {

          paymentId: {
            type: "string"
          },

          statusCode: {
            type: "string",
            enum: ["SUCCESS", "FAILED", "REFUNDED"]
          },

          transactionId: {
            type: "string"
          },

          gatewayResponse: {
            type: "object"
          }

        }
      }

    }
  }
};