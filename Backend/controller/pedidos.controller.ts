import { Request, Response } from 'express';
import db from '../config/db.config';
import { QueryError, RowDataPacket } from 'mysql2';

export async function getAuthUserPedidos(req: Request, res: Response) {

    const query = `
        SELECT p.id as pedidoId, p.fecha, p.usuario, p.estado, pr.nombre as productoNombre, pr.precio, pr.imagen 
        FROM pedido p 
        JOIN productos_pedidos pp ON p.id = pp.pedido
        JOIN producto pr ON pr.id = pp.producto
        WHERE p.usuario = ?
        ORDER BY p.fecha DESC
    `;

    db.query<RowDataPacket[]>(query, [req.user!.id], (err, results) => {
        if (err) return res.status(500).json({
            mensaje: "Error obteniendo productos: " + err.message
        });
        const pedidos = procesarPedidos(results);
        console.log(results);
        console.log(pedidos);
        res.json(pedidos);
    });
}

export async function getAll(req: Request, res: Response) {
    const query = `
        SELECT p.id as pedidoId, u.nombre as usuario, p.fecha, p.estado, pr.nombre as productoNombre, pr.precio, pr.imagen 
        FROM pedido p 
        JOIN productos_pedidos pp ON p.id = pp.pedido
        JOIN producto pr ON pr.id = pp.producto
        JOIN usuario u ON p.usuario = u.id 
        WHERE p.usuario = ?
        ORDER BY p.fecha DESC
    `;
    
    db.query<RowDataPacket[]>(query, [req.user!.id], (err, results) => {
        if (err) return res.status(500).json({
            mensaje: "Error obteniendo productos: " + err.message
        });
        const pedidos = procesarPedidos(results);
        console.log(results);
        console.log(pedidos);
        res.json(pedidos);
    });
}

function procesarPedidos(results: RowDataPacket[]) {
        const pedidosMap = new Map();

        for (const row of results) {
            if (!pedidosMap.has(row.pedidoId)) {
                pedidosMap.set(row.pedidoId, {
                    id: row.pedidoId,
                    fecha: row.fecha,
                    estado: row.estado,
                    usuario: row.usuario,
                    productos: []
                });
            }
            if (row.productoNombre) {
                pedidosMap.get(row.pedidoId).productos.push({
                    nombre: row.productoNombre,
                    precio: row.precio,
                    imagen: row.imagen
                });
            }
        }

        return Array.from(pedidosMap.values());
}

export async function actualizarEstado(req: Request<{ id?: number }, {}, {estado: string}>, res: Response) {
    const query = `
    UPDATE pedido SET estado = ? WHERE id = ?
    `;
    db.execute(query, [req.body.estado, req.params.id!], (err, results) => {
        if (err) return res.status(500).json({
            mensaje: "Error actualizando estado: " + err.message
        });
        return res.status(200);
    });
}