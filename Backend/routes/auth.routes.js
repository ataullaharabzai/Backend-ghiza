const express = require('express')
const authController = require('../controllers/auth.controller')


const router = express.Router()

router.post('/register', authController.userRegister)
router.post('/login', authController.loginUser)
router.patch('/update/:id', authController.updateUser)
router.delete('/logout/:id', authController.deleteUser)


module.exports = router