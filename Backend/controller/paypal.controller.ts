import { createPaypalOrder, capturePaypalOrder } from "../services/paypal.service";
import { Request, Response } from "express";
import db from '../config/db.config'
import { Pedido } from "../types/pedido.interface";
import { ResultSetHeader, RowDataPacket } from "mysql2";

function queryRows<T = RowDataPacket[]>(sql: string, params: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(results as T);
    });
  });
}

function executeResult(sql: string, params: any[] = []): Promise<ResultSetHeader> {
  return new Promise((resolve, reject) => {
    db.execute(sql, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(results as ResultSetHeader);
    });
  });
}

export async function createOrder(req: Request<{}, {}, Pedido>, res: Response) {
  try {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: "El total es inválido" });
    }

    const productIds = items.map((item) => item.id);
    const stockRows = await queryRows<RowDataPacket[]>(
      `SELECT id, nombre, stock FROM producto WHERE id IN (?)`,
      [productIds]
    );

    if (stockRows.length !== items.length) {
      return res.status(404).json({ error: 'Uno o más productos no existen' });
    }

    for (const item of items) {
      const product = stockRows.find((row) => row.id === item.id);
      if (!product) {
        return res.status(404).json({ error: 'Uno o más productos no existen' });
      }

      if (product.stock < item.cantidad) {
        return res.status(409).json({
          error: `Stock insuficiente para ${product.nombre}`,
        });
      }
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

    const pedidoRows = await queryRows<RowDataPacket[]>(
      `SELECT producto, cantidad FROM productos_pedidos WHERE pedido = ?`,
      [pedido]
    );

    if (pedidoRows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para el pedido' });
    }

    db.beginTransaction(async (transactionError) => {
      if (transactionError) {
        console.error('Error iniciando transacción:', transactionError.message);
        return res.status(500).json({
          error: 'Error iniciando la actualización de inventario',
          details: transactionError.message
        });
      }

      try {
        for (const row of pedidoRows) {
          const updateResult = await executeResult(
            `UPDATE producto SET stock = stock - ? WHERE id = ? AND stock >= ?`,
            [row.cantidad, row.producto, row.cantidad]
          );

          if (updateResult.affectedRows === 0) {
            throw new Error(`Stock insuficiente para el producto ${row.producto}`);
          }
        }

        await executeResult(`UPDATE pedido SET estado = ? WHERE id = ?`, ['Pagado', pedido]);

        db.commit((commitError) => {
          if (commitError) {
            db.rollback(() => {
              console.error('Error confirmando transacción:', commitError.message);
              return res.status(500).json({
                error: 'Error confirmando el descuento de inventario',
                details: commitError.message,
              });
            });
            return;
          }

          res.status(200).json(captureData);
        });
      } catch (error: any) {
        db.rollback(() => {
          console.error('Error descontando inventario:', error.message);
          return res.status(409).json({
            error: 'No hay stock suficiente para completar el pedido',
            details: error.message,
          });
        });
      }
    });
  } catch (error: any) {
    console.error('Error en captureOrder:', error.message);

    res.status(500).json({
      error: 'No se pudo capturar la orden',
      detalle: error.message
    });
  }
}