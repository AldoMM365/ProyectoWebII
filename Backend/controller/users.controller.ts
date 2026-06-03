import { Response, Request } from 'express';
import db from '../config/db.config';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import { User } from '../types/user.interface';

export function updateAuthUser(req: Request<{}, any, { nombre: string; email: string }>, res: Response) {
    const query = `
    UPDATE usuario
    SET
    nombre = ?,
    correo = ?
    WHERE
    id = ?
    `;

    db.execute(query, [req.body.nombre, req.body.email, req.user!.id], (err, result) => {
        if (err) return res.status(500).json({mensaje: err.message});
        res.json({result});
    })
}

export async function changePassword(req: Request<{}, { currentPassword: string, newPassword: string }>, res: Response) {
    const query = "SELECT clave FROM usuario WHERE id = ?";
    db.execute<RowDataPacket[]>(query, [req.user!.id], async (err, results) => {
        if (err) return res.status(401).json({ mensaje: err.message });
        const validPassword = await bcrypt.compare(req.body.currentPassword, results[0].clave);
        if (!validPassword) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        const insertQuery = "UPDATE usuario SET clave = ? WHERE id = ?";
        db.execute<RowDataPacket[]>(insertQuery, [hashedPassword, req.user!.id], (err, results) => {
            if (err) return res.status(401).json({ mensaje: err.message });
            return res.json({ mensaje: 'Usuario creado con éxito' });
        });
    });
}

export async function deleteAccount(req: Request<{}, { currentPassword: string, newPassword: string }>, res: Response) {
    const query = "UPDATE usuario SET valid = FALSE WHERE id = ?";
    db.execute<RowDataPacket[]>(query, [req.user!.id], async (err, results) => {
            if (err) return res.status(401).json({ mensaje: err.message });
            return res.json({ mensaje: 'Usuario borrado con éxito' });
    });
}
