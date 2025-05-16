const { Router } = require('express')

const WeatherController = require('../controllers/WeatherController.js')

const router = Router()
const weatherController = new WeatherController()
// ----------------------------------------------------------------------------------------
router.get('/',weatherController.getWeather)

module.exports = router