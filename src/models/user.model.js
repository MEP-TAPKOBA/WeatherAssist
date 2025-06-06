const { Schema, model } = require('mongoose')

const dataSchema = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true }
})

module.exports = model("UserData", dataSchema)