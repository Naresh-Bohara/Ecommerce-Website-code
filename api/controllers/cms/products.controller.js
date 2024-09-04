const { errorMsg, notFoundError } = require("@/lib");
const { Product, Category, Brand } = require("@/models");
const {unlinkSync} = require("node:fs")


class ProductsCtrl {
    index = async(req, res, next)=>{
    try {
     /* let products = await Product.aggregate()
      .lookup({from:'categories', localField:'categoryId', foreignField: '_id', as:'category'})
      .lookup({from:'brands', localField:'brandId', foreignField: '_id', as:'brand'}) */

      let products = await Product.aggregate([
        {$lookup: {from:'categories', localField:'categoryId', foreignField: '_id', as:'category'}},
        {$lookup: {from:'brands', localField:'brandId', foreignField: '_id', as:'brand'}}
      ])

      for(let i in products){
        products[i].category = products[i].category[0]
        products[i].brand = products[i].brand[0]
      }

      res.send(products);
    } catch (error) {
      errorMsg(error, next);
      console.log(error)
    }
  }

  store = async (req, res, next) => {
    try {
      let { name, description, summary, price, discountedPrice, categoryId, brandId, status, featured } = req.body;
      
      const images = req.files.map(file=>file.filename)

      await Product.create({ name, description, summary, price, discountedPrice, categoryId, brandId, status, featured, images });
      res.status(201)
      res.json({
        message: "product added successfully"
      });
    } catch (error) {
      errorMsg(error, next);
    }
  }

  show = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.send(product);
      } else {
        return notFoundError("Product", next)
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  }

  update = async (req, res, next) => {
    try {
      let { name, description, summary, price, discountedPrice, categoryId, brandId, status, featured } = req.body;
      
      const product = await Product.findById(req.params.id)

      let images = product.images

      if(req.files?.length > 0){
        const temp = req.files.map(file=>file.filename)
        images = [...images, ...temp]
      }
         
      if(product){
        await Product.findByIdAndUpdate(req.params.id, { name, description, summary, price, discountedPrice, categoryId, brandId, status, featured, images }, {runValidators:true});

        res.send({
          message: "product updated successfully."
        })
      }else{
        return notFoundError("Product", next)
      }
    } catch (error) {
      errorMsg(error, next);
    }
  }

destroy = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return notFoundError("Product", next);
    }

    for (let image of product.images) {
      const imagePath = `uploads/${image}`;
      try {
        unlinkSync(imagePath);
        console.log(`File ${image} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting file ${imagePath}:`, error);
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (deletedProduct) {
      return res.send({ message: "Product deleted successfully." });
    } else {
      console.error(`Failed to delete product with id ${req.params.id}.`);
      return next(new Error(`Failed to delete product with id ${req.params.id}.`));
    }
  } catch (error) {
    console.error("Error in destroy method:", error);
    return errorMsg(error, next);
  }
};

  
deleteImage = async (req, res, next) => {
  const { id, filename } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return notFoundError("Product", next);
    }

    const imageIndex = product.images.indexOf(filename);
    if (imageIndex === -1) {
      return notFoundError("Image", next);
    }

    const imagePath = `uploads/${filename}`;
    unlinkSync(imagePath);
    console.log(`Image ${filename} deleted successfully.`);

    product.images.splice(imageIndex, 1);
    await product.save();

    res.send({ message: `Image ${filename} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting image:", error);
    return errorMsg(error, next);
  }
};

}

module.exports = new ProductsCtrl();
