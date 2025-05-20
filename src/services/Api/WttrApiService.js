const axios = require('axios')

class WttrApiService {
    static async getWeatherByQuery(city = 'Слов`янськ') {
            try {
                const url = `https://wttr.in/${city}?format=j1`
                const headers = {
                    'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'accept': 'application/json, text/plain, */*'
                };
    
                return axios.get(url, { headers }).then(res => res.data);
            } catch (error) {
                console.error('Error fetching weather data:', error)
                return null
            }
        }
}
module.exports = WttrApiService