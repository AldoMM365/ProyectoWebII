import { createPaypalOrder, capturePaypalOrder } from "../services/paypal.service";
import { Request, Response } from "express";
import db from '../config/db.config'
import { Pedido } from "../types/pedido.interface";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function createOrder(req: Request<{}, {}, Pedido>, res: Response) {
  try {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: "El total es inválido" });
    }

    const order = await createPaypalOrder(total, items);
    const query = `
        INSERT INTO pedido (orderId, usuario) VALUES (?, ?)
        `;
    db.execute<ResultSetHeader>(query, [order.id, req.user!.id], (err, result) => {
      if (err) console.log(err.message);
      else {
        const productosQuery = `INSERT INTO productos_pedidos (producto, pedido, cantidad) VALUES ?`
        const values = items.map((p) => {
          return [
            p.id,
            result.insertId,
            p.cantidad
          ];
        });
        console.log(values);
        db.query(productosQuery, [values], (err, results) => {
          if (err) console.log(err.message);
          else res.status(200).json({
            id: order.id,
            pedido: result.insertId,
            status: order.status,
          });
        })
      }
    });

  } catch (error: any) {
    console.error("Error creando orden de PayPal:", error);
    res.status(500).json({
      error: "Error creating PayPal order",
      details: error.message
    });
  }
}

export async function captureOrder(req: Request, res: Response) {
  try {
    const { orderId, pedido } = req.body;
    console.log(orderId, pedido);
    if (!orderId) {
      return res.status(400).json({
        error: 'orderId es obligatorio'
      });
    }

    const captureData = await capturePaypalOrder(orderId);

    const updateQuery = `UPDATE pedido SET estado = ? WHERE id = ?`;
    db.execute(updateQuery, ['Pagado', pedido], (err) => {
      if (err) {
        console.error('Error actualizando el estado del pedido:', err.message);
        return res.status(500).json({
          error: 'Error actualizando el estado del pedido',
          details: err.message
        });
      }
      res.status(200).json(captureData);
    });
  } catch (error: any) {
    console.error('Error en captureOrder:', error.message);

    res.status(500).json({
      error: 'No se pudo capturar la orden',
      detalle: error.message
    });
  }
}