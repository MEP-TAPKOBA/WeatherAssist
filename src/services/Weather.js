const UserService = require('./UserService.js')
const userService = new UserService
const express = require('express')

const app = express()
app.use(express.json())

class Weather {
    static async get(userName, password) {
        const user = await userService.login(userName,password)
        if (Array.isArray(user)) {
            return user
        }
        const city = user.city
        const url = `https://wttr.in/${city}?format=j1`
        const weatherToday = []
        let response
        await fetch(url, {
            headers: {
                "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка сети: " + response.status);
                }
                return response.json(); // Преобразуем ответ в JSON
            })
            .then(data => {
                console.log(data.current_condition[0].observation_time)
                response = data
            })
            .catch(error => {
                console.error("Ошибка при получении данных:", error);
            });
        response.weather[0].hourly.forEach(element => {
            
            const timeStr = String(element.time).padStart(4, "0");
            const hours = timeStr.slice(0, 2);
            const minutes = timeStr.slice(2);
            element.time = `${hours}:${minutes}`

            const block = {
                Время: element.time,
                Небо: element.lang_ru[0].value,
                Температура: `${element.tempC}°C`,
                'Ощущается как': `${element.FeelsLikeC}°C`,
                'Направление ветра': element.winddir16Point,
                'Скорость ветра': `${element.windspeedKmph} Км/Ч`,
                Влажность: `${element.humidity}%`,
                Давление: `${element.pressure} Паскаля`,
                Облачность: `${element.cloudcover}%`
            }
            weatherToday.push(block)

        });
        const tomorrowMidnight = response.weather[1].hourly[0]

        const weatherTomorrowInMidnight = {
            Время: `Завтра в ${tomorrowMidnight.time}0:00`,
            Небо: tomorrowMidnight.lang_ru[0].value,
            Температура: `${tomorrowMidnight.tempC}°C`,
            'Ощущается как': `${tomorrowMidnight.FeelsLikeC}°C`,
            'Направление ветра': tomorrowMidnight.winddir16Point,
            'Скорость ветра': `${tomorrowMidnight.windspeedKmph} Км/Ч`,
            Влажность: `${tomorrowMidnight.humidity}%`,
            Давление: `${tomorrowMidnight.pressure} Паскаля`,
            Облачность: `${tomorrowMidnight.cloudcover}%`
        }
        weatherToday.push(weatherTomorrowInMidnight)
        const area = `${response.nearest_area[0].areaName[0].value},${response.nearest_area[0].region[0].value}`
        return [200,area,weatherToday]
    }
}

module.exports = Weather