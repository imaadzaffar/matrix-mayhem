const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const { user_signup, user_login, user_delete } = require('../controllers/user')

router.post('/signup', user_signup)

router.post('/login', user_login)

router.delete('/:userId', checkAuth, user_delete)

module.exports = router
