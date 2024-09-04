const { errorMsg, notFoundError } = require("@/lib");
const Category = require("@/models/category.model.js");

class CategoriesCtrl {
  index = async (req, res, next) => {
    try {
      let categories = await Category.find();
      res.send(categories);
    } catch (error) {
      errorMsg(error, next);
    }
  }

  store = async (req, res, next) => {
    try {
      const { name, status } = req.body;
      const category = await Category.create({ name, status });
      res.status(201).json({
        message: "Category added successfully"
      });
    } catch (error) {
      errorMsg(error, next);
    }
  }

  show = async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id);
      if (category) {
        res.send(category);
      } else {
        return notFoundError("Category", next)
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  }

  update = async (req, res, next) => {
    try {
      let { name, status } = req.body;
      const category = await Category.findById(req.params.id)
      if (category) {
        await Category.findByIdAndUpdate(req.params.id, { name, status }, {runValidators:true});

        res.send({
          message: "Category updated successfully."
        })
      } else {
        return notFoundError("Category", next)
      }
    } catch (error) {
      errorMsg(error, next);
    }
  }

  destroy = async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id)
      if (category) {
        await Category.findByIdAndDelete(req.params.id);
        res.send({ message: "Category deleted successfully." });
      } else {
        return notFoundError("Category", next)
      }
    } catch (error) {
      errorMsg(error, next);
    }
  }
}

module.exports = new CategoriesCtrl();
