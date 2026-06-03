import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { aesKey } from '../config/crypto.config';



const verify = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({mensaje: 'Token no proporcionado'});
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, aesKey) as jwt.JwtPayload;
        req.user = {
            nombre: decoded.nombre,
            id: decoded.id,
            rol: decoded.rol,
            email: decoded.email
        };
        next();
    } catch (error: any) {
        console.log(error.message);
        return res.status(403).json({mensaje: 'Token inválido o expirado'});
    }
}

export default verify;