const { Schema, model } = require('mongoose')

const dataSchema = new Schema({
    userName : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    city : {type : String, required : true}
})

module.exports = model("UserData",dataSchema)