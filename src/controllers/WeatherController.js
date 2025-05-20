const getDate = require('../utilts/getDate.js')

class WeatherController {
    constructor(weatherService) {
        this.weatherService = weatherService
    }
    async getWeather(req, res) {
        const  token  = req.query
        const [status, city, response] = await this.weatherService.get(token)
        const weather = {city,request_time:getDate(), response}
        res.status(status).json({weather})
    }
}
module.exports = WeatherController 