const { Router } = require('express')
const express = require('express')

const { BaseHelper } = require('../helpers/BaseHelper.js')
const { UserServices } = require('../services/UserServices.js')


const router = Router()
const Helper = new BaseHelper
const DBCORE = new UserServices()



router.delete('/delete', async (req, res) => {
    const { userName, password } = req.query
    const [status, message] = await DBCORE.deleteUser(userName, password)
    res.status(status).json({ message })
})

module.exports = router