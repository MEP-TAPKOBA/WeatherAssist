const mongoose = require('mongoose')
const { model , Schema } = require('mongoose')
const UserData = require('../models/user.model.js')
const express = require('express')
const app = express()
app.use(express.json())
const getDate = require('../utilts/getDate.js')


const CODES = {
    userNotFound: {status: 404, message: `Неправильное имя пользователя`},
    incorrectPassword: {status: 400, message: `Неправильный пароль`},
    internalServerError: {status: 500, message: `Произошла неизвестная ошибка на стороне сервера`},
    deleteSuccess: {status: 200, message : `Пользователь успешно удален`},
    allreadyUserName: {status: 400, message: `Такое имя пользователя уже зарегистрировано`},
    userSaveSuccess: { status: 200, message: `Пользователь успешно создан`},
    changePasswordSuccess: {status: 200, message: `Пароль успешно сменен`}
}

class UserServices {
    async login(userName, password) {
        // Описываю логи, что бы было проще дебажить, потом удалю //
        console.log(`--- [${getDate({type:"full"})}] --- Попытка входа в аккаунт [${userName}] ---`) 
        const user = await UserData.findOne({userName})
        if(!user) {
            console.log(`--- [${getDate({type:"full"})}] --- ✖ Пользователь не найден ✖ ---`)
            return Object.values(CODES.userNotFound)
        }
        if (user.password !== password){
            console.log(`--- [${getDate({type:"full"})}] --- ✖ Неправильный пароль ✖ ---`)
            return Object.values(CODES.incorrectPassword)
        }
        console.log(`--- [${getDate({type:"full"})}] --- ✔ Успешный вход ✔ ---`)
        return user
    }
    async addUser(dto){ // dto - Data Transfer Object
        console.log(`\n--- [${getDate({type:"full"})}] --- Попытка создания нового пользователя [${dto.userName}] ---`)
        const userHasInBase = await UserData.findOne({userName: dto.userName})
        if (userHasInBase){
            console.log(`--- [${getDate({type:"full"})}] --- ✖ Такой пользователь уже есть в системе ✖ ---`)
            return Object.values(CODES.allreadyUserName)
        }
        const user = new UserData(dto)
        await user.save()
        console.log(`--- [${getDate({type:"full"})}] --- ✔ Пользователь успешно создан ✔ ---`)
        return Object.values(CODES.userSaveSuccess)      
    }
    async changePassword(userName, password, newPassword) {
        console.log(`\n--- [${getDate({type:"full"})}] --- Запрос на смену пароля ---`)
        const user = await this.login(userName, password)
        if (Array.isArray(user)){
            return user
        }
        const oldPassword = user.password
        user.password = newPassword
        await user.save()
        console.log(`--- [${getDate({type:"full"})}] --- ✔ Пароль успешно заменен ✔ ---`)
        console.log(`--- [${getDate({type:"full"})}] --- Старый пароль [${oldPassword}] --- Новый пароль [${newPassword}] ---`)
        return Object.values(CODES.changePasswordSuccess)

    }   
    async deleteUser(userName, password) {
        console.log(`\n--- [${getDate({type:"full"})}] --- Запрос на удаление пользователя ---`)
        const user = await this.login(userName, password)
        if (Array.isArray(user)){
            return user
        }
        const result = await UserData.findByIdAndDelete(user._id)
        if (!result){
            return Object.values(CODES.internalServerError)
        }
        console.log(`--- [${getDate({type:"full"})}] --- ✔ Пользователь удален ✔ ---`)
        return Object.values(CODES.deleteSuccess)
    }
}

module.exports = {UserServices}