const { Router } = require('express')
const UserService = require('../services/UserService.js')
const WeatherService = require('../services/WeatherService.js')
const WeatherController = require('../controllers/WeatherController.js')
const JWTService = require('../services/JWTService.js')

const router = Router()
const JWT = new JWTService()
const userService = new UserService(JWT)
const weatherService = new WeatherService(userService)
const weatherController = new WeatherController(weatherService)
// ----------------------------------------------------------------------------------------
router.get('/',weatherController.getWeather.bind(weatherController))

module.exports = router