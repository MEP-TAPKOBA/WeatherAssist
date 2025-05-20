const UserData = require('../models/user.model.js')
const CODES = require('../json/codes.json')
const getDate = require('../utilts/getDate.js')

class UserService {
    constructor(JWT){
        this.JWT = JWT
    }
    async check(login, password) {
        if (!login) return [400, `Не указано имя пользователя`]
        console.log(`--- [${getDate()}] --- Попытка входа в аккаунт [${login}] ---`)
        const user = await UserData.findOne({ login: login })
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
    async login(login, password){
        const user = await this.check(login, password)
        if (Array.isArray(user)){
            return user
        }
        console.log(user.login)
        console.log(`--- [${getDate()}] --- ✔ Генерация токена ✔ ---`)
        const token = this.JWT.generateToken(user.login)
        return [200, {token:token}]
    }
    async authFromJWT(token){
        const login = this.JWT.getLoginFromToken(token.token)
        if (!login) {
            return [400, [`Токен недействителен`]]
        }
        const user = await UserData.findOne({login: login})
        return user
    }
    async create(dto) { // dto - Data Transfer Object
        console.log(`\n--- [${getDate()}] --- Попытка создания нового пользователя [${dto.login}] ---`)
        const userHasInBase = await UserData.findOne({ login: dto.login })
        if (userHasInBase) {
            console.log(`--- [${getDate()}] --- ✖ Такой пользователь уже есть в системе ✖ ---`)
            return Object.values(CODES.allreadyUserName)
        }
        const user = new UserData(dto)
        await user.save()
        console.log(`--- [${getDate()}] --- ✔ Пользователь успешно создан ✔ ---`)
        return Object.values(CODES.userSaveSuccess)
    }
    async changePassword(login, password, newPassword) {
        console.log(`\n--- [${getDate()}] --- Запрос на смену пароля ---`)
        const user = await this.check(login, password)
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
    async changeCity(login, password, newCity) {
        console.log(`\n--- [${getDate()}] --- Запрос на смену города ---`)
        const user = await this.check(login, password)
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
    async delete(login, password) {
        console.log(`\n--- [${getDate()}] --- Запрос на удаление пользователя ---`)
        const user = await this.check(login, password)
        if (Array.isArray(user)) {
            console.log(`Произошла ошибка :DDD`)
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

module.exports = UserService