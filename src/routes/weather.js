const { Router } = require('express')
const UserService = require('../services/UserService.js')
const WeatherService = require('../services/WeatherService.js')
const WeatherController = require('../controllers/WeatherController.js')

const router = Router()
const userService = new UserService()
const weatherService = new WeatherService(userService)
const weatherController = new WeatherController(weatherService)
// ----------------------------------------------------------------------------------------
router.get('/',weatherController.getWeather.bind(weatherController))

module.exports = router