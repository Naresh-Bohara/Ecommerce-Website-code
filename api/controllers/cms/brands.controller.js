const { errorMsg, notFoundError } = require("@/lib");
const Brand = require("@/models/brand.model.js");

class BrandsCtrl {
    index = async(req, res, next)=>{
    try {
      let brands = await Brand.find();
      res.send(brands);
    } catch (error) {
      errorMsg(error, next);
    }
  }

  store = async (req, res, next) => {
    try {
      const { name, status } = req.body;
      const brand = await Brand.create({ name, status });
      res.status(201)
      res.json({
        message: "Brand added successfully"
      });
    } catch (error) {
      errorMsg(error, next);
    }
  }

  show = async (req, res, next) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (brand) {
        res.send(brand);
      } else {
        return notFoundError("Brand", next)
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  }

  update = async (req, res, next) => {
    try {
      let { name, status } = req.body;
      const brand = await Brand.findById(req.params.id)
      if(brand){
        await Brand.findByIdAndUpdate(req.params.id, { name, status }, {runValidators: true});

        res.send({
          message: "Brand updated successfully."
        }) 
      }else{
        return notFoundError("Brand", next)
      }
    } catch (error) {
      errorMsg(error, next);
    }
  }

  destroy = async(req, res, next) =>{
    try {
      const brand = await Brand.findById(req.params.id)
      if(brand){
        await Brand.findByIdAndDelete(req.params.id);
        res.send({ message: "Brand deleted successfully." });
      }else{
        return notFoundError("Brand", next)
      }
    } catch (error) {
      errorMsg(error, next);
    }
  }
}

module.exports = new BrandsCtrl();
