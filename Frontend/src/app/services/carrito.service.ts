import { Injectable, signal, computed, Signal } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Lista reactiva del carrito
  private productosSignal = signal<Map<Producto, number>>(new Map());

  // Exponer como readonly
  productos = this.productosSignal.asReadonly();

  agregar(producto: Producto) {
    if (this.productosSignal().has(producto)) {
      this.productosSignal.update(lista => {
        const newMap = new Map(lista);
        newMap.set(producto, newMap.get(producto)! + 1);
        return newMap;
      });
    } else {
      this.productosSignal.update(lista => {
        const newMap = new Map(lista);
        newMap.set(producto, 1);
        return newMap;
      });
    }
  }

  quitar(producto: Producto) {
    this.productosSignal.update(lista => {
      const newMap = new Map(lista);
      if (newMap.has(producto)) {
        const cantidad = newMap.get(producto)!;
        if (cantidad > 1) {
          newMap.set(producto, cantidad - 1);
        } else {
          newMap.delete(producto);
        }
      }
      return newMap;
    });
  }

  vaciar() {
    this.productosSignal.set(new Map());
  }

  total(): number {
    let total = 0;
    for (const [producto, cantidad] of this.productosSignal().entries()) {
      total += producto.precio * cantidad;
    }
    return total;
  }

  cantidad(): number {
      let total = 0;
      for(const [producto, cantidad] of this.productosSignal().entries()) {
        total += cantidad;
      }
      return total;
  }

  exportarXML() {
    const productos = this.productosSignal();

    // Estructura XML manual
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;

    for (const [producto, cantidad] of productos.entries()) {
      xml += `  <producto>\n`;
      xml += `    <id>${producto.id}</id>\n`;
      xml += `    <nombre>${this.escapeXml(producto.nombre)}</nombre>\n`;
      xml += `    <cantidad>${cantidad}</cantidad>\n`;
      xml += `    <precio>${producto.precio * cantidad}</precio>\n`;
      if (producto.descripcion) {
        xml += `    <descripcion>${this.escapeXml(producto.descripcion)}</descripcion>\n`;
      }
      xml += `  </producto>\n`;
    }

    xml += `  <total>${this.total()}</total>\n`;
    xml += `</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();

    URL.revokeObjectURL(url);
  }

  private escapeXml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }
}