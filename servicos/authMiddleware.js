import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './config.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'Token necessário' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token inválido' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
};
