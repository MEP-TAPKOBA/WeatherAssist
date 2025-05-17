const Helper = require('../helpers/Helper.js')

class UserController {
    constructor(userService){
        this.userService = userService
    }
    async create(req, res) {
        let data = req?.body
        data.login = Helper.format(data.login)
        const [status, message] = await this.userService.create(data)
        res.status(status).json({ message })
    }
    async changeCity(req, res) {
        const { login, password, newCity } = req.query
        const [status, message] = await this.userService.changeCity(login, password, newCity)
        res.status(status).json({ message })
    }
    async changePassword(req, res) {
        const {  login, password, newPassword } = req.query
        const [status, message] = await this.userService.changePassword(login, password, newPassword)
        res.status(status).json({ message })
    }
    async delete(req, res) {
        const { login, password } = req.query
        const [status, message] = await this.userService.delete(login, password)
        res.status(status).json({ message })
    }

}
module.exports = UserController
