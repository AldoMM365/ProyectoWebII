import db from '../config/db.config';
import {Request, Response} from 'express';
import { Producto } from '../types/producto.interface';
export async function getProducts (req: Request, res: Response) {
    const query = `
        SELECT
            id,
            sku,
            nombre,
            precio,
            descripcion,
            stock,
            imagen,
            categoria
        FROM producto
        WHERE deleted = FALSE
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Error fetching products' });
        }
        res.json(results);
    });
};
export async function addProduct (req: Request<{}, any, Producto>, res: Response) {
    const query = `
    INSERT INTO producto (
        sku,
        nombre,
        precio,
        descripcion,
        stock,
        imagen,
        categoria
    ) VALUES (
     ?, ?, ?, ?, ?, ?, ?
    )
    `;

    db.execute(query, [
        req.body.sku,
        req.body.nombre,
        req.body.precio,
        req.body.descripcion,
        req.body.stock,
        req.body.imagen,
        req.body.categoria
    ], (err, results) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ error: 'Error inserting product' });
        }
        res.json(results);
    })
}
export async function updateProduct (req: Request<{}, any, Producto>, res: Response) {
    const query = `
    UPDATE producto SET
    sku = ?,
    nombre = ?,
    precio = ?,
    descripcion = ?,
    stock = ?,
    imagen = ?,
    categoria = ?
    WHERE id = ?
    `;

    db.execute(query, [
        req.body.sku,
        req.body.nombre,
        req.body.precio,
        req.body.descripcion,
        req.body.stock,
        req.body.imagen,
        req.body.categoria,
        req.body.id!
    ], (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Error updating products' });
        }
        res.json(results);
    })

}
export async function removeProduct (req: Request<{id?: number}>, res: Response) {
    const query = `UPDATE producto SET deleted = TRUE WHERE id = ?`;
    db.execute(query, [req.params.id!], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Error deleting products' });
        }
        res.json(results);
    });
}