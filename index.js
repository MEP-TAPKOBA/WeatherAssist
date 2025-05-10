const express = require('express')
const mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
const UserData = require('./models/user.data.js')
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 5000
const DBUSER = process.env.DBUSER
const DBPASS = process.env.DBPASS

function format(str) {
    const userName = str.replace(/\s+/g, '')
    return userName.toLowerCase()
}

async function conn() {
    console.log(`Подключение к базе данных...`)
    mongoose.set("strictQuery", false)
    try {
        await mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASS}@cluster0.ulqn2ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`Подключение к базе данных прошло успешно :-) `)
    } catch (e) { console.log(`Подключение не удалось :-(\n${e}`) }
}

async function main() {
    await conn()
    app.use(express.json())
    //делаем вызов метода GET что бы увидеть работоспособность сервера
    app.get('/', (req, res) => {
        res.status(200).json({ message: `Сервер запущен ${Date.now()}` })
    })
    // делаем запрос для создания юзера, входные данные { "userName": "value", "password": "value", "city": "value"}
    app.post('/signup', async (req, res) => {
        let data = req?.body
        data.userName = format(data.userName) // вызываем функцию format(), что бы  привести значение ключа userName в нужный вид(удалить все пробелы и сделать все символы маленькими)
        let user = await UserData.findOne({ userName: data.userName })
        if (user) {
            return res.status(400).json({ message: `Пользователь с ником ${user.userName} уже есть в системе` })
        }
        saveUser = new UserData(data)
        console.log(`Новый пользователь:`)
        console.table(data)
        console.log(`Сохранение пользователя ${data.userName} в базу...`)
        await saveUser.save()
        console.log(`Пользователь ${data.userName} добавлен в базу`)
        res.status(200).json({ message: `Пользователь ${data.userName} добавлен в базу :-)` })

    })
    //---------------------------------------------- последняя строчка функции - запуск сервера ----------------------------------------------------
    app.listen(PORT, () => {
        console.log(`Приложение запущено и работает. Порт: ${PORT}`)
    })
}
main()