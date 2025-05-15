const Weather = require('../services/Weather.js')
const getDate = require('../utilts/getDate.js')

class WeatherController { 
    async getWeather(req, res) {
        const { userName, password } = req.query
        const [status, city,response] = await Weather.get(userName, password)
        const weather = {city,time:getDate(), response}
        res.status(status).json({weather})
    }
}
module.exports = WeatherController 