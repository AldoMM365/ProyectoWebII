import { Component, computed, signal } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { ProductService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { ProductoCardComponent } from '../producto/producto.component';
import { CarritoComponent } from '../carrito/carrito.component';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductoCardComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class Catalogo {
  products = signal<Producto[]>([]);
  inStockCount = computed(() => this.products().filter(p => p.stock > 0).length);

  constructor(
    private productsService: ProductService,
    private carritoService: CarritoService
  ) {
    this.productsService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando XML:', err),
    });
  }

  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }
}
