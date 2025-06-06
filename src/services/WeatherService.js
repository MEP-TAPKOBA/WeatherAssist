const CODES = require('../json/codes.json')
const WttrApiService = require('../services/Api/WttrApiService.js')

class WeatherService {
    constructor(userService) {
        this.userService = userService
    }
    toFormat(json) {
        const result = []
        for (const unit of json.weather[0].hourly) {
            const timeStr = String(unit.time).padStart(4, "0"); //} 
            const hours = timeStr.slice(0, 2);                  //}есть варик сделать через регулярку const time = String(info.time).padStart(4, '0').match(/.{1,2}/g).join(':');
            const minutes = timeStr.slice(2);                   //}
            unit.time = `${hours}:${minutes}`                   //}
            const block = {
                time: unit.time,
                sky: unit.lang_ru[0].value,
                tempC: `${unit.tempC}°C`,
                feelsLikeC: `${unit.FeelsLikeC}°C`,
                windDir16P: unit.winddir16Point,
                windSpeed: `${unit.windspeedKmph} Км/Ч`,
                humidity: `${unit.humidity}%`,
                pressure: `${unit.pressure} Паскаля`,
                cloudCover: `${unit.cloudcover}%`
            }
            result.push(block)
        }
        const tomorrowMidnight = json.weather[1].hourly[0]
        const lastBlock = {
            time: `Завтра в ${tomorrowMidnight.time}0:00`,
            sky: tomorrowMidnight.lang_ru[0].value,
            tempC: `${tomorrowMidnight.tempC}°C`,
            feelsLikeC: `${tomorrowMidnight.FeelsLikeC}°C`,
            windDir16P: tomorrowMidnight.winddir16Point,
            windSpeed: `${tomorrowMidnight.windspeedKmph} Км/Ч`,
            humidity: `${tomorrowMidnight.humidity}%`,
            pressure: `${tomorrowMidnight.pressure} Паскаля`,
            cloudCover: `${tomorrowMidnight.cloudcover}%`
        }
        result.push(lastBlock)
        return result
    }
    async get(token) {
        const user = await this.userService.authFromJWT(token)
        if (Array.isArray(user)) {
            return user
        }
        const jsonRes = await WttrApiService.getWeatherByQuery(user.city)
        if (!jsonRes)
            return Object.values(CODES.internalServerError)
        const weatherToday = this.toFormat(jsonRes)
        const area = ['country', 'region', 'areaName'].map(key => jsonRes.nearest_area[0][key][0].value).join(', ');
        return [200, area, weatherToday]
    }
}

module.exports = WeatherService