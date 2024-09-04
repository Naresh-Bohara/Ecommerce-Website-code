const express = require('express');
const router = express.Router();
const {Auth} = require('@/controllers')


router.post('/login', Auth.LoginCtrl.login)
router.post('/register', Auth.RegisterCtrl.register)

module.exports = router;  
