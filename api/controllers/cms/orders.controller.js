const { errorMsg, notFoundError } = require("@/lib");
const { Order, User, Product } = require("@/models");

class OrdersCtrl {
  // List all orders with user and product details
  index = async (req, res, next) => {
    try {
      const orders = await Order.aggregate([
        { $lookup: { from: "orderdetails", localField: "_id", foreignField: "orderId", as: "details" } },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }
      ]);

      for (const order of orders) {
        order.user = order.user[0]; // Flatten user array

        for (const detail of order.details) {
          detail.product = await Product.findById(detail.productId).select('-__v'); // Fetch product details without the __v field
        }
      }

      res.send(orders);
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  // Update an order's status
  update = async (req, res, next) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).send({ message: "Order not found." });
      }

      order.status = status;
      await order.save();
      
      res.send({ message: "Order updated successfully." });
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  // Delete an order
  destroy = async (req, res, next) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);

      if (!order) {
        return notFoundError("Order", next);
      }

      res.send({ message: "Order deleted successfully." });
    } catch (err) {
      return errorMsg(err, next);
    }
  };
}

module.exports = new OrdersCtrl();
