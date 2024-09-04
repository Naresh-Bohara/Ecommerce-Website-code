const { model, Schema } = require("mongoose");
const modelConfig = require("@/config");

let User = model(
  "User",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
      maxLength: 20,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Staff", "Customer"],
      default: "Customer",
    },
    status: {
      type: Boolean,
      default: true,
    },
  }, modelConfig)
);

module.exports = User;
