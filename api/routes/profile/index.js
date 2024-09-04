const express = require("express");
const { Profile } = require("@/controllers");
const { customerAccess, roleAccess } = require("@/lib");

const router = express.Router();

router.get("/", Profile.ProfileCtrl.show);

router
  .route("/edit")
  .put(Profile.ProfileCtrl.update)
  .patch(Profile.ProfileCtrl.update);

router
  .route("/password")
  .put(Profile.ProfileCtrl.updatePassword)
  .patch(Profile.ProfileCtrl.updatePassword);

  router.get("/reviews", customerAccess, Profile.ProfileCtrl.reviews)
  router.get("/orders", customerAccess, Profile.ProfileCtrl.orders)

module.exports = router;
