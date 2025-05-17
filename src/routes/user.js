const { Router } = require('express')
const UserService  = require('../services/UserService.js')
const UserController = require('../controllers/UserController.js')

const router = Router()
const userService = new UserService()
const userController = new UserController(userService)
// ----------------------------------------------------------------------------------------
router.post('/signup', userController.create.bind(userController))
router.patch('/update/city', userController.changeCity.bind(userController))
router.patch('/update/password', userController.changePassword.bind(userController))
router.delete('/delete', userController.delete.bind(userController))

module.exports = router