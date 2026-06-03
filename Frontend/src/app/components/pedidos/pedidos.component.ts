import { Component, OnInit, inject, signal } from '@angular/core';
import { PedidosService, Pedido } from '../../services/pedidos.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {
  pedidos = signal<Pedido[]>([]);
  cargando = true;
  error = '';

  constructor(
      private pedidosService: PedidosService
    ) {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => {
        this.cargando = false;
        this.pedidos.set(data);
      },
      error: (err) => {
        console.error('Error al obtener pedidos', err);
        this.error = 'No se pudieron cargar los pedidos.';
        this.cargando = false;
      }
    });
  }

  calcularTotal(pedido: Pedido): number {
    return pedido.productos.reduce((total, producto) => total + producto.precio, 0);
  }
}