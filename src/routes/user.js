const { Router } = require('express')
const UserService  = require('../services/UserService.js')
const UserController = require('../controllers/UserController.js')
const JWTService = require('../services/JWTService.js')

const router = Router()
const JWT = new JWTService()
const userService = new UserService(JWT)
const userController = new UserController(userService)
// ----------------------------------------------------------------------------------------
router.post('/signup', userController.create.bind(userController))
router.post('/login', userController.login.bind(userController))
router.patch('/update/city', userController.changeCity.bind(userController))
router.patch('/update/password', userController.changePassword.bind(userController))
router.delete('/delete', userController.delete.bind(userController))

module.exports = router