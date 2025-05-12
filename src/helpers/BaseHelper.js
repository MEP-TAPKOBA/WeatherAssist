class BaseHelper {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    format(str) {
        const userName = str.replace(/[\s\n\r]+/g, '')
        return userName.toLowerCase()
    }
    
}

module.exports = { BaseHelper }