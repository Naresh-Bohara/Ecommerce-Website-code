const express = require("express");
const router = express.Router();
const authRoutes = require("@/routes/auth");
const profileRoutes = require("./profile");
const { auth, cmsAccess } = require("@/lib");
const cmsRoutes = require("./cms")
const frontRoutes = require("./front")

router.use("/auth", authRoutes);
router.use("/profile", auth, profileRoutes);
router.use("/cms", auth, cmsAccess, cmsRoutes)
router.use(frontRoutes)

module.exports = router;
