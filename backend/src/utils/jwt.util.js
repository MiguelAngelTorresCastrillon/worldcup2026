
// Patrón: Singleton
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

class JwtUtil {
  constructor() {
    if (JwtUtil.instance) {
      return JwtUtil.instance;
    }
    JwtUtil.instance = this;
  }

  sign(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  }

  verify(token) {
    return jwt.verify(token, jwtSecret);
  }
}

module.exports = new JwtUtil();
