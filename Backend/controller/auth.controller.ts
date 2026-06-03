import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../config/db.config';
import { User } from '../types/user.interface';
import { RowDataPacket } from 'mysql2';
import { aesKey } from '../config/crypto.config';

export const register = async (req: Request, res: Response) => {
    //Verificar si el usuario existe
    const { email, password }: { email: string, password: string, name: string } = req.body;
    console.log(email, password);
    const selectQuery = "SELECT * FROM usuario WHERE correo = ?";
    db.execute<RowDataPacket[]>(selectQuery, [email], async (err, results) => {
        if (err) return res.status(401).json({ mensaje: err.message });
        if (results.length > 0) return res.status(401).json({ mensaje: 'El correo ya existe' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = "INSERT INTO usuario (correo, clave) values (?, ?)";
        console.log(email, hashedPassword)
        db.execute<RowDataPacket[]>(insertQuery, [email, hashedPassword], (err, results) => {
            if (err) return res.status(401).json({ mensaje: err.message });
            return res.json({ mensaje: 'Usuario creado con éxito' });
        });
    });
}

export const login = async (req: Request, res: Response) => {
    const { email, password }: { email: string, password: string } = req.body;
    const query = "SELECT usuario.id as id, usuario.nombre as nombre, usuario.clave as clave, rol.nombre as rol FROM usuario JOIN rol ON usuario.rol = rol.id WHERE correo = ? AND usuario.valid = TRUE";
    db.execute<RowDataPacket[]>(query, [email], async (err, results) => {
        if (err) return res.status(401).json({ mensaje: err.message });
        if (results.length === 0) return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        const userPassword = results[0].clave;
        const validPassword = await bcrypt.compare(password, userPassword);
        if (!validPassword) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
        const user: User = {
            id: results[0].id,
            email,
            rol: results[0].rol,
            nombre: results[0].nombre
        }
        const token = jwt.sign(user, aesKey, {
            expiresIn: '1h'
        });
        res.json(token);
    });
}

