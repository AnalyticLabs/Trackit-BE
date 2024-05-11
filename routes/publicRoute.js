const express = require('express')

const { login } = require('../controllers/auth')

const router = express.Router()


router.route('/trackit-login').post(login)

module.exports = router