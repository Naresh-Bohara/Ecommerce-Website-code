const { Cms } = require("@/controllers");
const { fileUpload } = require("@/lib");
const express = require("express");

const router = express.Router();

const mimeList = [
  'image/jpeg',
  'image/png',
  'image/gif',
]

router.route("/")
  .get(Cms.ProductsCtrl.index)
  .post(fileUpload(mimeList).array("images"), Cms.ProductsCtrl.store);

router.route("/:id")
  .get(Cms.ProductsCtrl.show)
  .put(fileUpload(mimeList).array("images"), Cms.ProductsCtrl.update)
  .patch(fileUpload(mimeList).array("images"), Cms.ProductsCtrl.update)
  .delete(Cms.ProductsCtrl.destroy);

  router.delete("/:id/image/:filename", Cms.ProductsCtrl.deleteImage);
module.exports = router;
