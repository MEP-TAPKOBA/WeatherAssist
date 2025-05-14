const UserService = require('../services/UserService.js')
const Helper = require('../helpers/Helper.js')

const userService = new UserService()

class UserController {
    async addUser(req, res) {
        let data = req?.body
        data.userName = Helper.format(data.userName)
        const [status, message] = await userService.addUser(data)
        res.status(status).json({ message })
    }
    async changeCity(req, res) {
        const { userName, password, newCity } = req.query
        const [status, message] = await userService.changeCity(userName, password, newCity)
        res.status(status).json({ message })
    }
    async changePassword(req, res) {
        const { userName, password, newPassword } = req.query
        const [status, message] = await userService.changePassword(userName, password, newPassword)
        res.status(status).json({ message })
    }
    async deleteUser(req, res) {
        const { userName, password } = req.query
        const [status, message] = await userService.deleteUser(userName, password)
        res.status(status).json({ message })
    }

}
module.exports = UserController 