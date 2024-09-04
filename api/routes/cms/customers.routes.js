const { Cms } = require("@/controllers");
const express = require("express");
const router = express.Router();

router.route("/")
.get(Cms.CustomersCtrl.index)
.post(Cms.CustomersCtrl.store);

router
  .route("/:id")
  .get(Cms.CustomersCtrl.show)
  .put(Cms.CustomersCtrl.update)
  .patch(Cms.CustomersCtrl.update)
  .delete(Cms.CustomersCtrl.destroy);

module.exports = router;
