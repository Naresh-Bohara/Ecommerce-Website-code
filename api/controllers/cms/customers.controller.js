const bcrypt = require("bcryptjs");
const { User } = require("@/models");
const { errorMsg, validationErrMsg, notFoundError } = require("@/lib");

class CustomersCtrl {
  index = async (req, res, next) => {
    try {
      let customers = await User.find({ role: "Customer" }).exec();
      res.send(customers);
    } catch (err) {
      errorMsg(err, next);
    }
  };

  store = async (req, res, next) => {
    try {
      let { name, email, password, confirmPassword, phone, address, status } =
        req.body;
      if (password == confirmPassword) {
        let hashed = bcrypt.hashSync(password);

        await User.create({
          name,
          email,
          password: hashed,
          phone,
          address,
          status,
        });
        res.status(201);
        res.json({
          message: "Customer added successfully",
        });
      } else {
        return validationErrMsg({ password: `Password not confirmed` }, next);
      }
    } catch (error) {
      return errorMsg(error, next);
    }
  };

  show = async (req, res, next) => {
    try {
      const user = await User.findOne({
        _id: req.params.id,
        role: "Customer",
      });

      if (user) {
        res.send(user);
      } else {
        return notFoundError("Customer", next);
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  update = async (req, res, next) => {
    try {
      let { name, email, phone, address, status } = req.body;

      const user = await User.findById(req.params.id);

      if (user && user.role == "Customer") {
        await User.findByIdAndUpdate(
          req.params.id,
          { name, email, phone, address, status },
          { runValidators: true }
        );

        res.send({
          message: "Customer updated successfully.",
        });
      } else {
        return notFoundError("Customer", next);
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  };

  destroy = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (user && user.role == "Customer") {
        await User.findByIdAndDelete(req.params.id);

        res.send({
          message: "Customer deleted successfully.",
        });
      } else {
        return notFoundError("Customer", next);
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  };
}

module.exports = new CustomersCtrl();
