const {model, Schema } = require('mongoose');
const modelConfig = require("@/config");

const OrderDetail = model('OrderDetail', new Schema({
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }, modelConfig));
module.exports= OrderDetail;