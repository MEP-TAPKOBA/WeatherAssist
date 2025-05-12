const express = require('express')
const mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
const UserData = require('./models/user.model.js')
require('dotenv').config()
const app = express()
const getDate = require('./utilts/getDate.js')
const { BaseHelper } = require('./helpers/BaseHelper.js')
const { UserServices } = require('./services/UserServices.js')

const UserRouter = require('./routes/user.js') //////////////////

const Helper = new BaseHelper
const DBCORE = new UserServices()

const PORT = process.env.PORT || 5000
const DBUSER = process.env.DBUSER
const DBPASS = process.env.DBPASS
const ADMINPASS = process.env.ADMINPASS

async function conn() {
    console.log(`--- [${getDate({type:"full"})}] --- Подключение к базе данных ... ---`)
    mongoose.set("strictQuery", false)
    try {
        await mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASS}@cluster0.ulqn2ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`--- [${getDate({type:"full"})}] --- ✔ Подключение к базе данных прошло успешно :-) ✔ ---`)
        await Helper.sleep(1000)

    } catch (e) { console.log(`--- [${getDate({type:"full"})}] --- ✖ Подключение не удалось :-( ✖ ---\n--- ${e} ---`)}
}
async function main() {
    await conn()
    app.use(express.json())
    app.use('/user', UserRouter) 
    //делаем вызов метода GET что бы увидеть работоспособность сервера
    app.get('/', (req, res) => {
        res.status(200).json({ message: `--- ✔ Сервер запущен ✔ [${getDate({type:"full"})}]  ---` })
    })
    // делаем запрос для создания юзера, входные данные { "userName": "value", "password": "value", "city": "value"}
    app.post('/signup', async (req, res) => {
        let data = req?.body
        data.userName = Helper.format(data.userName)
        const [status, message] = await DBCORE.addUser(data)
        res.status(status).json({ message })
    })
    // запрос на смену пароля у юзера
    app.patch('/user/update/password', async (req, res) => {
        const { userName, password, newPass } = req.query
        const [status, message] = await DBCORE.changePassword(userName, password, newPass)
        res.status(status).json({ message })
    })
    //---------------------------------------------- последняя строчка функции - запуск сервера ----------------------------------------------------
    app.listen(PORT, () => {
        console.log(`--- [${getDate({type:"full"})}] --- ✔ Приложение запущено и работает. Порт: ${PORT} ✔ ---`)
    })
}
main()
