import { Request, Response, NextFunction } from "express";

const verify = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.rol === 'empleado') next();
    else res.status(403).json({
        mensaje: 'Token inválido o expirado'
    });
}
export default verify;