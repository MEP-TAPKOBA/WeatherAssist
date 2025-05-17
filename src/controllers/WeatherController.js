const getDate = require('../utilts/getDate.js')

class WeatherController {
    constructor(weatherService) {
        this.weatherService = weatherService
    }
    async getWeather(req, res) {
        const { login, password } = req.query
        const [status, city,response] = await this.weatherService.get(login, password)
        const weather = {city,request_time:getDate(), response}
        res.status(status).json({weather})
    }
}
module.exports = WeatherController 