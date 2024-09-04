const { errorMsg, validationErrMsg } = require("@/lib");
const { User } = require("@/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class LoginCtrl {
  login = async (req, res, next) => {
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ email }).select("+password");
      //   res.send(user);

      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign(
            {
              uid: user._id,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            },
            process.env.JWT_SECRET
          );
          res.send({ token });
        } else {
          return validationErrMsg({ password: `Please enter correct Password` }, next);
        }
      } else {
        return validationErrMsg(
          { email: `Given email is not registered.` },
          next
        );
      }
    } catch (err) {
      errorMsg(err, next);
    }
  };
} 

module.exports = new LoginCtrl();
