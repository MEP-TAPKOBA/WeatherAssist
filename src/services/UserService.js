const UserData = require('../models/user.model.js')
const CODES = require('../json/codes.json')
const getDate = require('../utilts/getDate.js')
const express = require('express')

const app = express()
app.use(express.json())

class UserService {
    async login(userName, password) {
        // Описываю логи, что бы было проще дебажить, потом удалю //
        console.log(`--- [${getDate()}] --- Попытка входа в аккаунт [${userName}] ---`)
        const user = await UserData.findOne({ userName })
        if (!user) {
            console.log(`--- [${getDate()}] --- ✖ Пользователь не найден ✖ ---`)
            return Object.values(CODES.userNotFound)
        }
        if (user.password !== password) {
            console.log(`--- [${getDate()}] --- ✖ Неправильный пароль ✖ ---`)
            return Object.values(CODES.incorrectPassword)
        }
        console.log(`--- [${getDate()}] --- ✔ Успешный вход ✔ ---`)
        return user
    }
    async addUser(dto) { // dto - Data Transfer Object
        console.log(`\n--- [${getDate()}] --- Попытка создания нового пользователя [${dto.userName}] ---`)
        const userHasInBase = await UserData.findOne({ userName: dto.userName })
        if (userHasInBase) {
            console.log(`--- [${getDate()}] --- ✖ Такой пользователь уже есть в системе ✖ ---`)
            return Object.values(CODES.allreadyUserName)
        }
        const user = new UserData(dto)
        await user.save()
        console.log(`--- [${getDate()}] --- ✔ Пользователь успешно создан ✔ ---`)
        return Object.values(CODES.userSaveSuccess)
    }
    async changePassword(userName, password, newPassword) {
        console.log(`\n--- [${getDate()}] --- Запрос на смену пароля ---`)
        const user = await this.login(userName, password)
        if (Array.isArray(user)) {
            return user
        }
        const oldPassword = user.password
        user.password = newPassword
        await user.save()
        console.log(`--- [${getDate()}] --- ✔ Пароль успешно заменен ✔ ---`)
        console.log(`--- [${getDate()}] --- Старый пароль [${oldPassword}] --- Новый пароль [${newPassword}] ---`)
        return Object.values(CODES.changePasswordSuccess)

    }
    async changeCity(userName, password, newCity) {
        console.log(`\n--- [${getDate()}] --- Запрос на смену города ---`)
        const user = await this.login(userName, password)
        if (Array.isArray(user)) {
            return user
        }
        const firstCity = user.city
        user.city = newCity
        await user.save()
        console.log(`--- [${getDate()}] --- ✔ Город успешно заменен ✔ ---`)
        console.log(`--- [${getDate()}] --- Старый город [${firstCity}] --- Новый город [${newCity}] ---`)
        return Object.values(CODES.changeCitySuccess)
    }
    async deleteUser(userName, password) {
        console.log(`\n--- [${getDate()}] --- Запрос на удаление пользователя ---`)
        const user = await this.login(userName, password)
        if (Array.isArray(user)) {
            return user
        }
        const result = await UserData.findByIdAndDelete(user._id)
        if (!result) {
            return Object.values(CODES.internalServerError)
        }
        console.log(`--- [${getDate()}] --- ✔ Пользователь удален ✔ ---`)
        return Object.values(CODES.deleteSuccess)
    }
}

module.exports = { UserService }