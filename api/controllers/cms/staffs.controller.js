const { errorMsg, validationErrMsg, notFoundError } = require("@/lib");
const bcrypt = require("bcryptjs");
const { User } = require("@/models");

class StaffsCtrl {
  index = async (req, res, next) => {
    try {
      let staffs = await User.find({ role: "Staff" }).exec();

      res.send(staffs);
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
          name, email, password: hashed, phone, address, status, role: "Staff",
        });
        res.status(201);
        res.json({
          message: "Staff added successfully",
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
      const user = await User.findOne({ _id: req.params.id, role:'Staff'});

      if (user) {
        res.send(user);
      } else {
        return notFoundError("Staff", next)
      }
    } catch (err) {
      return errorMsg(err, next);
    }
  };
  update = async (req, res, next) => {
    try {
      let { name, email, phone, address, status } = req.body;
      
      const user = await User.findById(req.params.id)

      if(user && user.role=="Staff"){
        await User.findByIdAndUpdate(req.params.id, { name, email, phone, address, status }, {runValidators:true})

        res.send({
          message: "Staff updated successfully.",
        });
      }else{
        return notFoundError("Staff", next)
      }

    } catch (err) {
      return errorMsg(err, next);
    }
  };
  destroy = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)

      if(user && user.role=="Staff"){
        await User.findByIdAndDelete(req.params.id)

        res.send({
          message: "Staff deleted successfully.",
        });
      }else{
        return notFoundError("Staff", next)
      }

    } catch (err) {
      return errorMsg(err, next);
    } 
  };
}

module.exports = new StaffsCtrl();
