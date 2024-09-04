const express = require("express");
const staffsRoutes = require("./staffs.routes.js");
const customersRoutes = require("./customers.routes.js");
const brandsRoutes = require("./brands.routes.js");
const categoriesRoutes = require("./categories.routes.js")
const productsRoutes = require("./products.routes.js")
const reviewsRoutes = require("./reviews.routes.js")
const ordersRoutes = require("./orders.routes.js")
const { adminAccess } = require("@/lib");

const router = express.Router();

router.use("/staffs", adminAccess, staffsRoutes);
router.use("/customers", customersRoutes);
router.use("/brands", brandsRoutes)
router.use("/categories", categoriesRoutes)
router.use("/products", productsRoutes)
router.use("/reviews", reviewsRoutes)
router.use("/orders", ordersRoutes)

module.exports = router;