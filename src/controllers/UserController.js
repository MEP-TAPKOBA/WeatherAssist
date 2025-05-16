const UserService = require('../services/UserService.js')
const Helper = require('../helpers/Helper.js')

const userService = new UserService()

class UserController {
    async addUser(req, res) {
        let data = req?.body
        data.login = Helper.format(data.login)
        const [status, message] = await userService.addUser(data)
        res.status(status).json({ message })
    }
    async changeCity(req, res) {
        const { login, password, newCity } = req.query
        const [status, message] = await userService.changeCity(login, password, newCity)
        res.status(status).json({ message })
    }
    async changePassword(req, res) {
        const {  login, password, newPassword } = req.query
        const [status, message] = await userService.changePassword(login, password, newPassword)
        res.status(status).json({ message })
    }
    async deleteUser(req, res) {
        const { login, password } = req.query
        const [status, message] = await userService.deleteUser(login, password)
        res.status(status).json({ message })
    }

}
module.exports = UserController 