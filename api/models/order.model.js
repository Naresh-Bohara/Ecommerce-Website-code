const {model, Schema } = require('mongoose');
const modelConfig = require("@/config");

const Order = model('Order', new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    orderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }]
  }, modelConfig));
module.exports= Order;