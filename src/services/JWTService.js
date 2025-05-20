const jwt = require('jsonwebtoken');
require('dotenv').config()

class JWTService {
  constructor() {
    this.secretKey = process.env.JWT_KEY;
  }

  // Генерируем токен с username и временем жизни 1 час
  generateToken(login) {
    const payload = { login };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
    return token
  }

  // Декодируем токен, возвращаем username или null если невалидный
  getLoginFromToken(token) {
    try {  
      const decoded = jwt.verify(token, this.secretKey)
      return decoded.login ;
    } catch (err) {
      console.error('Ошибка проверки токена:', err.message);
    }
  }
}

module.exports = JWTService;