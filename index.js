const express = require('express')
const mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
const UserData = require('./models/user.model.js')
require('dotenv').config()
const app = express()
const { UserServices }  = require('./src/services/UserServices.js')

const DBCORE = new UserServices()

const PORT = process.env.PORT || 5000
const DBUSER = process.env.DBUSER
const DBPASS = process.env.DBPASS
const ADMINPASS = process.env.ADMINPASS

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function format(str) {
    const userName = str.replace(/[\s\n\r]+/g, '')
    return userName.toLowerCase()
}
async function conn() {
    console.log(`Подключение к базе данных...`)
    mongoose.set("strictQuery", false)
    try {
        await mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASS}@cluster0.ulqn2ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`Подключение к базе данных прошло успешно :-) `)
        await sleep(1000)
        
    } catch (e) { console.log(`Подключение не удалось :-(\n${e}`) }
}
async function main() {
    await conn()
    app.use(express.json())
    //делаем вызов метода GET что бы увидеть работоспособность сервера
    app.get('/', (req, res) => {
        res.status(200).json({ message: `Сервер запущен ${new Date(Date.now())}` })
    })
    // делаем запрос для создания юзера, входные данные { "userName": "value", "password": "value", "city": "value"}
    app.post('/signup', async (req, res) => {
        let data = req?.body
        data.userName = format(data.userName)
        const [status, message] = await DBCORE.addUser(data) 
        res.status(status).json({message})
    })
    // запрос на удаление юзера с помощью query
    app.delete('/user/delete', async (req, res) =>{
        const { userName, password } = req.query
        const [status, message] = await DBCORE.deleteUser(userName, password)
        res.status(status).json({message})
    })
    // запрос на смену пароля у юзера
    app.patch('/user/update/password', async (req, res) =>{
        const { userName, password, newPass } = req.query
        const [status, message] = await DBCORE.changePassword(userName, password, newPass)
        res.status(status).json({message})
    })
    //---------------------------------------------- последняя строчка функции - запуск сервера ----------------------------------------------------
    app.listen(PORT, () => {
        console.log(`Приложение запущено и работает. Порт: ${PORT}`)
    })
}
main()
