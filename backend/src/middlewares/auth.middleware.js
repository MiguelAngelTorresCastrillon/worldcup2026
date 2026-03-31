// src/middlewares/auth.middleware.js
// Middleware para proteger rutas con JWT
const jwtUtil = require('../utils/jwt.util');
const AppError = require('../errors/AppError');

/**
 * Verifica que el usuario esté autenticado
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticación requerido', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtUtil.verify(token);
    
    req.user = decoded;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401));
    }
    next(error);
  }
};

/**
 * Verifica que el usuario tenga rol de ADMIN
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Acceso denegado. Se requiere rol de administrador', 403));
  }
  next();
};

/**
 * Verifica que el usuario tenga uno de los roles especificados
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`Acceso denegado. Roles requeridos: ${roles.join(', ')}`, 403));
    }
    next();
  };
};

module.exports = { requireAuth, requireAdmin, requireRole };
