const mongoose = require('mongoose')
require('dotenv').config()
const Helper = require('../helpers/Helper.js')
const getDate = require('../utilts/getDate.js')

class Database {
    #DBUSER
    #DBPASS
    #URI
    constructor(){
        this.#DBUSER = process.env.DBUSER
        this.#DBPASS = process.env.DBPASS
        this.#URI = `mongodb+srv://${this.#DBUSER}:${this.#DBPASS}@cluster0.ulqn2ds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    }
    async conn() {
        console.log(`--- [${getDate()}] --- Подключение к базе данных ... ---`)
        mongoose.set("strictQuery", false)
        try {
            await mongoose.connect(this.#URI)
            console.log(`--- [${getDate()}] --- ✔ Подключение к базе данных прошло успешно :-) ✔ ---`)
            await Helper.sleep(1000)
        } catch (e) { console.log(`--- [${getDate()}] --- ✖ Подключение не удалось :-( ✖ ---\n--- ${e} ---`) }
    }
    static async run() {
        const db = new Database()
        await db.conn()
        return db
    }   
}

module.exports = Database 
