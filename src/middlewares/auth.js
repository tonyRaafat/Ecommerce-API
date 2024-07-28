import jwt from 'jsonwebtoken';
import { throwError } from '../utils/throwerror.js';
import { User } from '../../database/models/user.model.js';

export const auth = async (req, res, next) => {
  if (req?.header('token') == undefined) { throw throwError('token was not provided in header', 400) }
  const token = req.header('token');
  if (!token) return res.statusCode(401).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '2h' });
    if (!decoded?.email) throw throwError('invalid token payload', 400)
    const user = await User.findById(decoded._id)
    if(parseInt(user.passwordChanged.getTime()/1000)> decoded.iat) throw throwError("token is invalid",403)
    req.user = user
    next();
  } catch (error) {
    next(error)
  }
};

export const authorization = (roles = []) => {
  return (req, res, next) => {
    try {
      const { role } = req.user;
      if (!roles.includes(role)) throw throwError('you are not authorized', 401)
      next()
    } catch (error) {
      next(error)
    }
  }
}

