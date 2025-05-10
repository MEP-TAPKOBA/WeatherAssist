const express = require('express')
const mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
const UserData = require('./models/user.model.js')
require('dotenv').config()
const app = express()

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
        data.userName = format(data.userName) // вызываем функцию format(), что бы  привести значение ключа userName в нужный вид(удалить все пробелы и сделать все символы маленькими)
        const user = await UserData.findOne({ userName: data.userName })
        if (user) {
            return res.status(400).json({ message: `Пользователь с ником ${user.userName} уже есть в системе` })
        }
        const saveUser = new UserData(data)
        console.log(`Новый пользователь:`)
        console.table(data)
        console.log(`Сохранение пользователя ${data.userName} в базу...`)
        await saveUser.save()
        console.log(`Пользователь ${data.userName} добавлен в базу`)
        res.status(200).json({ message: `Пользователь ${data.userName} добавлен в базу :-)` })
    })
    // запрос на удаление юзера с помощью query
    app.delete('/user/delete', async (req, res) =>{
        const { userName, password } = req.query
        const user = await UserData.findOne({userName})
        console.log(`Попытка удалить пользователя ${userName}`)
        if (!user){
            console.log(`Такого пользователя в системе не оказалось 0_0`)
            return res.status(404).json({message: "Такого пользователя нет в системе"})
        }
        if (user.password !== password){
            return res.status(400).json({message: "Неправильный пароль"})
        }
        const result = await UserData.findByIdAndDelete(user._id); // поиск по id в mongoDB
        if (!result) {
            return res.status(404).json({ message: 'Произошла неизвестная ошибка' });
        }
        console.log(`Пользователь ${user.userName} удален`)
        res.status(200).json({message: `Пользователь ${user.userName} удален из базы данных! :-)`})
    })
    // запрос на смену пароля у юзера
    app.patch('/user/update/password', async (req, res) =>{
        const { userName, password, newPass } = req.query
        const user = await UserData.findOne({userName})
        console.log(`Запрос на смену пароля от пользователя ${userName}`)
        if (!user){
            console.log(`Такого пользователя в системе не оказалось 0_0`)
            return res.status(404).json({message: "Такого пользователя нет в системе"})
        }
        if (user.password !== password){
            console.log(`Был введен неверный пароль`)
            return res.status(400).json({message: "Неправильный пароль"})
        }
        const oldPass = user.password
        user.password = newPass
        user.save()
        console.log(`Пользователь ${user.userName} сменил пароль`)
        console.log(`Старый пароль : [${oldPass}], новый пароль : [${newPass}]`)
        res.status(200).json({message: "Пароль сменен успешно"})
    })
    //---------------------------------------------- последняя строчка функции - запуск сервера ----------------------------------------------------
    app.listen(PORT, () => {
        console.log(`Приложение запущено и работает. Порт: ${PORT}`)
    })
}
main()
