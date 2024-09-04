const bcrypt = require("bcryptjs");
const { User } = require("@/models");
const { validationErrMsg } = require("@/lib");

class RegisterCtrl {
  register = async (req, res, next) => {
    try {
      let { name, email, password, confirmPassword, phone, address } = req.body;

      // Check if the user with the given email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return validationErrMsg({ email: "Email already in use" }, next);
      }

      if (password === confirmPassword) {
        let hashed = bcrypt.hashSync(password);

        await User.create({
          name,
          email,
          password: hashed,
          phone,
          address,
        });

        res.json({
          message: "Registration completed, Please proceed to login",
        });
      } else {
        return validationErrMsg(
          { password: "Password not confirmed" },
          next
        );
      }
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RegisterCtrl();
