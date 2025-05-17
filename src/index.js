require('dotenv').config()

const express = require('express')
const getDate = require('./utilts/getDate.js') // модуль получения даты
const UserRouter = require('./routes/user.js')
const WeatherRouter = require('./routes/weather.js')
const Database = require('./database/Database.js')

const PORT = process.env.PORT || 5000
const app = express()

async function main() {
    await Database.run()
    app.use(express.json())
    //делаем вызов метода GET что бы увидеть работоспособность сервера
    app.get('/', (req, res) => {
        res.status(200).json({ message: `--- ✔ Сервер запущен ✔ [${getDate()}]  ---` })
    })
    app.use('/user', UserRouter)
    app.use('/weather',WeatherRouter)
    //---------------------------------------------- последняя строчка функции - запуск сервера ----------------------------------------------------
    app.listen(PORT, () => {
        console.log(`--- [${getDate()}] --- ✔ Приложение запущено и работает. Порт: ${PORT} ✔ ---\n`)
    })
}
main()
