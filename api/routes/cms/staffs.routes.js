const { Cms } = require("@/controllers");
const express = require("express");

const router = express.Router();

router.route("/")
.get(Cms.StaffsCtrl.index)
.post(Cms.StaffsCtrl.store);

router
  .route("/:id")
  .get(Cms.StaffsCtrl.show)
  .put(Cms.StaffsCtrl.update)
  .patch(Cms.StaffsCtrl.update)
  .delete(Cms.StaffsCtrl.destroy);

module.exports = router;
