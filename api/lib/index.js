const jwt = require("jsonwebtoken");
const User = require("@/models/user.model.js");
const multer = require("multer");

/**
 * Handles returning of error message.
 */
const errorMsg = (error, next) => {
  console.error('Error occurred:', error); 
  if (error.code === 11000) {
    let errors = {};

    for (let key in error.keyValue) {
      errors[key] = `The value '${error.keyValue[key]}' for '${key}' is already in use`;
    }

    return next({
      message: "Validation error",
      errors,
      status: 422,
    });
  }

  if (error.errors) {
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return next({
      message: "Validation error",
      errors,
      status: 422,
    });
  }

  return next({
    message: "Error occurred",
    status: 400,
  });
};

const validationErrMsg = (errors, next) =>
  next({
    message: "Validation error",
    errors,
    status: 422,
  });

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next({
        message: "Authentication token is missing.",
        status: 401,
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.uid);

    if (!user) {
      return next({
        message: "Authentication token is invalid.",
        status: 401,
      });
    }

    req.uid = user._id;
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return next({
      message: "Authentication token is invalid.",
      status: 401,
    });
  }
};

const adminAccess = (req, res, next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    return next({
      message: "Access denied",
      status: 403,
    });
  }
};

const customerAccess = (req, res, next) => {
  if (req.user.role === "Customer") {
    next();
  } else {
    return next({
      message: "Access denied",
      status: 403,
    });
  }
};

const cmsAccess = (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Staff") {
    next();
  } else {
    return next({
      message: "Access denied",
      status: 403,
    });
  }
};

const roleAccess = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return next({
      message: "Access denied",
      status: 403,
    });
  }
  next();
};

const notFoundError = (name, next) =>
  next({
    message: `${name} Not Found`,
    status: 404,
  });

const fileUpload = (mimeList = []) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads");
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const filename =
          "file" + Date.now() + "-" + Math.round(Math.random() * 1e9) + `.${ext}`;

        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (mimeList.length > 0 && !mimeList.includes(file.mimetype)) {
        cb(new Error("File type not supported."), false);
      } else {
        cb(null, true);
      }
    },
  });

module.exports = {
  errorMsg,
  validationErrMsg,
  auth,
  cmsAccess,
  adminAccess,
  notFoundError,
  fileUpload,
  customerAccess,
  roleAccess,
};
