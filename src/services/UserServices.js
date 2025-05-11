const mongoose = require('mongoose')
const { model , Schema } = require('mongoose')
const UserData = require('../../models/user.model.js')
const express = require('express')
const app = express()
app.use(express.json())

class UserServices {
    login(userName, password) {
        // Описываю логи, что бы было проще дебажить, потом удалю //
        console.log(`---Попытка входа в аккаунт [${userName}]---`)
        const user = UserData.findOne({userName})
        if(!user) {
            console.log(`---Пользователь не найден---`)
            res.status(404).json({message: `Неправильное имя пользователя`}) // оно не знает что это //
            return false
        }
        if (user.password !== password){
            console.log(`---Неправильный пароль---`)
            res.status(400).json({message: "Неправильный пароль"}) // оно не знает что это, надо фиксить //
            return false
        }
        return user
    }

}

module.exports = {UserServices}