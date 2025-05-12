require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const getDate = require('./utilts/getDate.js') // модуль получения даты
const UserRouter = require('./routes/user.js')
const { BaseHelper } = require('./helpers/BaseHelper.js') // разные приятности

const Helper = new BaseHelper
const PORT = process.env.PORT || 5000
const DBUSER = process.env.DBUSER
const DBPASS = process.env.DBPASS
const app = express()

async function conn() {
    console.log(`--- [${getDate()}] --- Подключение к базе данных ... ---`)
    mongoose.set("strictQuery", false)
    try {
        await mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASS}@cluster0.ulqn2ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`--- [${getDate()}] --- ✔ Подключение к базе данных прошло успешно :-) ✔ ---`)
        await Helper.sleep(1000)
    } catch (e) { console.log(`--- [${getDate()}] --- ✖ Подключение не удалось :-( ✖ ---\n--- ${e} ---`) }
}
async function main() {
    await conn()
    app.use(express.json())
    app.use('/user', UserRouter)

    //делаем вызов метода GET что бы увидеть работоспособность сервера
    app.get('/', (req, res) => {
        res.status(200).json({ message: `--- ✔ Сервер запущен ✔ [${getDate()}]  ---` })
    })
    //---------------------------------------------- последняя строчка функции - запуск сервера ----------------------------------------------------
    app.listen(PORT, () => {
        console.log(`--- [${getDate()}] --- ✔ Приложение запущено и работает. Порт: ${PORT} ✔ ---\n`)
    })
}
main()
