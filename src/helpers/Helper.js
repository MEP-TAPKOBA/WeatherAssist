class Helper {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static format(str) {
        const userName = str.replace(/[\s\n\r]+/g, '')
        return userName.toLowerCase()
    }

}

module.exports = Helper 