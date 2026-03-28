// Patrón: Service Layer — contiene la lógica de negocio
const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const jwtUtil = require('../utils/jwt.util');
const AppError = require('../errors/AppError');

class AuthService {

  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('El email ya está registrado', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwtUtil.sign({ id: user.id, role: user.role });

    return { user, token };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwtUtil.sign({ id: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

}

module.exports = new AuthService();