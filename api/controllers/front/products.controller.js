const { errorMsg, notFoundError } = require("@/lib");
const { Product, Review, Brand } = require("@/models");
const mongoose = require("mongoose");

class ProductsCtrl {
  featured = async (req, res, next) => {
    try {
      let products = await Product.find({ featured: true, status: true }).limit(
        4
      );
      res.send(products);
    } catch (err) {
     return errorMsg(err, next);
    }
  };

  latest = async (req, res, next) => {
    try {
      let products = await Product.find({ status: true })
        .limit(4)
        .sort({ createdAt: "desc" });
      res.send(products);
    } catch (err) {
     return errorMsg(err, next);
    }
  };

  top = async (req, res, next) => {
    try {
      const products = await Product.aggregate([
        {$match:{status:true}},
        { $lookup: { from: "orderdetails", localField: "_id", foreignField: "productId", as: "orderdetails"}},
        { $addFields: { orderdetailsCount: { $size: "$orderdetails" } } },
        { $sort: { orderdetailsCount: -1 } },
      ]);

      res.send(products);
    } catch (err) {
     return errorMsg(err, next);
    }
  };

  byId = async (req, res, next) => {
    try {
      const product = await Product.findOne({_id:req.params.id, status:true})

      if (product) {
        const brand = await Brand.findById(product.brandId)
        const reviews = await Review.aggregate()
        .match({productId: new mongoose.Types.ObjectId(req.params.id)})
        .lookup({from: 'users', localField: 'userId', foreignField: '_id', as: 'user'})

        let newList = []
        for(let i in reviews){
          newList.push({
            ...reviews[i],
            user:{...reviews[i].user[0],
              password:undefined
            }
          })
        }
        res.send({...product.toObject(), reviews:newList, brand});
      } else {
        return notFoundError("Product", next);
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  similar = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return notFoundError("Product", next);
        }

        const similarProducts = await Product.find({
            categoryId: product.categoryId,
            _id: { $ne: product._id },
            status:true
        });

        res.send(similarProducts);
    } catch (err) {
       return errorMsg(err, next);
    }
};

// review = async(req, res, next)=>{
//   try{
//    const product = Product.findOne({_id:req.params.id, status:true})

//    if(product){
//     const { comment, rating } = req.body; 
//     await Review.create({
//       comment, 
//       rating,
//       productId: req.params.id,
//       userId: req.uid,
//     })

//     res.send({
//       message: "Thank you for your review"
//     })

//    }else{
//     return notFoundError("Product", next)
//    }
//   }catch(err){
//    return errorMsg(err, next)
//   }
// }


review = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: true });

    if (product) {
      const { comment, rating } = req.body;
      await Review.create({
        comment,
        rating,
        productId: req.params.id,
        userId: req.uid,
      });

      res.send({
        message: "Thank you for your review"
      });
    } else {
      return notFoundError("Product", next);
    }
  } catch (err) {
    return errorMsg(err, next);
  }
};


 search = async(req, res, next)=>{
  try{
    const {term} = req.query

    const products = await Product.find({
      name:{$regex: term, $options: 'i'},
      status:true
    })
    res.send(products)
  }catch(err){
   return errorMsg(err, next)
  }
}

}
module.exports = new ProductsCtrl();
 