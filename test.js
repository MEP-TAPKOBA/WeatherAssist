const city = "Слов`янськ"; // Замените на нужный город
const url = `https://wttr.in/${city}?format=j1`;
let response
const weatherToday = []

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
        // const currentTemp = response.current_condition[0].temp_C;
        // console.log(`Температура в ${city}: ${currentTemp}°C`);

    })
    .catch(error => {
        console.error("Ошибка при получении данных:", error);
    });


const today = (response.current_condition[0].localObsDateTime.slice(0, 10))
console.log(today)
response.weather[0].hourly.forEach(element => {
    const block = {
        time: element.time,
        tempC: element.tempC,
        feelsLikeC: element.FeelsLikeC,
        description: element.lang_ru[0].value,
        humidity: element.humidity,
        pressure: element.pressure,
        windDir16Point: element.winddir16Point,
        windspeedKmph: element.windspeedKmph,
        cloudCover: element.cloudcover
    }
    weatherToday.push(block)
    
});
for (const item of weatherToday){
    console.table(item)
}


