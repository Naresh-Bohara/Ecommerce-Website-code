const { errorMsg, validationErrMsg } = require("@/lib");
const { User, Review, Order, Product } = require("@/models");
const bcrypt = require("bcryptjs");
const { Types } = require("mongoose");

class ProfileCtrl {
  show = async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  update = async (req, res, next) => {
    try {
      let { name, phone, address } = req.body;
      await User.findByIdAndUpdate(req.uid, { name, phone, address }, 
        {runValidators: true});

      res.send({
        message: "Profile updated successfully.",
      });
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  updatePassword = async (req, res, next) => {
    try {
      let { oldPassword, newPassword, confirmPassword } = req.body;
      const user = await User.findById(req.uid).select("+password");

      if (bcrypt.compareSync(oldPassword, user.password)) {
        if (newPassword == confirmPassword) {
          const hash = bcrypt.hashSync(newPassword);
         await user.updateOne({ password: hash });

          res.send({
            message: "Password updated successfully.",
          });
        } else {
          return validationErrMsg(
            { password: "New password is not confirmed" },
            next
          );
        }
      } else {
        return validationErrMsg(
          { oldPassword: "Old Password is incorrect." },
          next
        );
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  reviews = async(req, res, next)=>{
   try{
    
    let reviews = await Review.aggregate([
      {$match:{userId: new Types.ObjectId(req.uid)}},
      {$lookup:{from: "products", localField: "productId", foreignField: "_id", as: "product"}}
    ])

    for(let i in reviews){
      reviews[i].product = reviews[i].product[0]
    }

    res.send(reviews)
   }catch(err){
    errorMsg(err, next)
   }
  }

  orders = async(req, res, next)=>{
    try {
      let orders = await Order.aggregate([
        { $match: { userId: new Types.ObjectId(req.uid) } },
        { $lookup: { from: "orderdetails", localField: "_id", foreignField: "orderId", as: "orderDetails" }},
        { $addFields: { orderDetailsCount: { $size: "$orderDetails" } } },
        { $match: { orderDetailsCount: { $gt: 0 } } },
        { $unset: "orderDetailsCount" }
      ]);
  
      for (let order of orders) {
        for (let detail of order.orderDetails) {
          detail.product = await Product.findById(detail.productId);
        }
      }
  
      res.send(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      errorMsg(err, next);
    }
    }
  
  }

module.exports = new ProfileCtrl();
