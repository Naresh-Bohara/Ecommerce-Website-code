const { Front } = require("@/controllers");
const { auth, customerAccess, roleAccess } = require("@/lib");
const express = require("express");

const router = express.Router();

router.get("/categories", Front.MiscCtrl.categories)
router.get("/categories/:id", Front.MiscCtrl.categoryById)
router.get("/categories/:id/products", Front.MiscCtrl.categoryProducts)

router.get("/brands", Front.MiscCtrl.brands)
router.get("/brands/:id", Front.MiscCtrl.brandById)
router.get("/brands/:id/products", Front.MiscCtrl.brandProducts)

router.post("/checkout", auth,customerAccess, Front.MiscCtrl.checkout)

module.exports = router;
