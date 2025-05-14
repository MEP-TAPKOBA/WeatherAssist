const { Router } = require('express')

const UserController = require('../controllers/UserController.js')

const router = Router()
const userController = new UserController()
// ----------------------------------------------------------------------------------------
router.post('/signup', userController.addUser)
router.patch('/update/city', userController.changeCity)
router.patch('/update/password', userController.changePassword)
router.delete('/delete', userController.deleteUser)

module.exports = router