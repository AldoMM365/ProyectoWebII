import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PedidosService, Pedido } from '../../services/pedidos.service';

@Component({
  selector: 'app-gestor-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './gestor-pedidos.component.html',
  styleUrl: './gestor-pedidos.component.css',
})
export class GestorPedidosComponent {
  pedidos: Pedido[] = [];
  forms: Record<number, FormGroup> = {};
  cargando = true;
  error = '';
  success = '';

  estados = ['Listo para entrega', 'entregado', 'cancelado'];

  constructor(
    private pedidosService: PedidosService,
    private fb: FormBuilder
  ) {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.error = '';

    this.pedidosService.obtenerPedidosEmpleado().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.forms = {};
        for (const pedido of data) {
          this.forms[pedido.id] = this.fb.group({
            estado: [pedido.estado, Validators.required],
          });
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los pedidos.';
        this.cargando = false;
      },
    });
  }

  actualizarEstado(pedido: Pedido): void {
    const form = this.forms[pedido.id];
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }

    this.success = '';
    this.error = '';

    this.pedidosService.actualizarEstadoPedido(pedido.id, form.value.estado).subscribe({
      next: () => {
        this.success = `Pedido #${pedido.id} actualizado con éxito.`;
        pedido.estado = form.value.estado;
      },
      error: (err) => {
        console.log('Error al actualizar estado del pedido', err);
        this.error = err?.error?.mensaje || 'No se pudo actualizar el estado del pedido.';
      },
    });
  }

  calcularTotal(pedido: Pedido): number {
    return pedido.productos.reduce((total, producto) => total + producto.precio, 0);
  }
}