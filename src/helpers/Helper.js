class Helper {
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static format(str) {
        const login = str.replace(/[\s\n\r]+/g, '')
        return login.toLowerCase()
    }

}

module.exports = Helper 