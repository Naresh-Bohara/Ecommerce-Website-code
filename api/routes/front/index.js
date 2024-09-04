const express = require("express");
const productsRoutes = require("./products.routes.js")
const miscRoutes = require("./misc.routes.js")

const router = express.Router();

router.use("/products", productsRoutes)
router.use(miscRoutes)

router.get("/image/:filename", (req, res, next)=>{
    res.sendFile(`uploads/${req.params.filename}`, {
        root: "./"
    })
})

module.exports = router;
