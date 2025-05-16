const WeatherService = require('../services/WeatherService.js')
const getDate = require('../utilts/getDate.js')

const weatherService = new WeatherService()

class WeatherController { 
    async getWeather(req, res) {
        const { login, password } = req.query
        const [status, city,response] = await weatherService.get(login, password)
        const weather = {city,request_time:getDate(), response}
        res.status(status).json({weather})
    }
}
module.exports = WeatherController 