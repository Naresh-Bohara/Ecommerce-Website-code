const { Cms } = require("@/controllers");
const express = require("express");

const router = express.Router();

router.get("/", Cms.ReviewsCtrl.index)

router.delete("/:id", Cms.ReviewsCtrl.destroy)

module.exports = router;