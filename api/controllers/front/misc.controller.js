const { errorMsg, notFoundError } = require("@/lib")
const { Category, Product, Brand, Order, OrderDetail } = require("@/models")

class MiscCtrl {
  categories = async(req, res, next)=>{
    try{
      const categoriesList = await Category.find({status:true})
     
      res.send(categoriesList)
    }catch(err){
        return errorMsg(err, next)
    }
  }

  categoryById = async(req, res, next)=>{
    try{
        const category = await Category.findOne({status:true, _id:req.params.id})
        if(category){
            res.send(category)
        }else{
            return notFoundError("Category", next)
        }
      }catch(err){
          return errorMsg(err, next)
      }
  }

  categoryProducts = async(req, res, next)=>{
    try{
        const products = await Product.find({status:true, categoryId: req.params.id})
  
        res.send(products)
      }catch(err){
          return errorMsg(err, next)
      }
  }

  brands = async(req, res, next)=>{
    try{
        const brandsList = await Brand.find({status:true})
  
        res.send(brandsList)
      }catch(err){
          return errorMsg(err, next)
      }
  }

  brandById = async(req, res, next)=>{
    try{
        const brand = await Brand.findOne({status:true, _id:req.params.id})
        if(brand){
            res.send(brand)
        }else{
            return notFoundError("Brand", next)
        }
      }catch(err){
          return errorMsg(err, next)
      }
  }

  brandProducts = async(req, res, next)=>{
    try{
        const products = await Product.find({status:true, brandId: req.params.id})
  
        res.send(products)
      }catch(err){
          return errorMsg(err, next)
      }
  }

  checkout = async(req, res, next) => {
    try {
      const cart = req.body;
      const order = await Order.create({ userId: req.uid, status: "Processing" });
  
      for (const item of cart) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).send({ error: `Product with ID ${item.productId} not found` });
        }
  
        const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
        const total = price * item.qty;
  
        await OrderDetail.create({
          productId: item.productId,
          orderId: order._id,
          price,
          total,
          qty: item.qty
        });
      }
  
      res.send({ message: "Thank you for your order! We will contact you soon for confirmation." });
    } catch (err) {
      return errorMsg(err, next);
    }
  }
  
}

module.exports = new MiscCtrl