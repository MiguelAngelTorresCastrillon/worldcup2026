// Patrón: MVC — Controller maneja la request y la response
const authService = require('../services/auth.service');

class AuthController {

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Validaciones básicas
      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Nombre, email y contraseña son obligatorios'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          status: 'fail',
          message: 'La contraseña debe tener mínimo 6 caracteres'
        });
      }

      const result = await authService.register({ name, email, password });

      return res.status(201).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email y contraseña son obligatorios'
        });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AuthController();