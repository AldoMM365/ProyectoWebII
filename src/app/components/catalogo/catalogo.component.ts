import { Component, computed, signal } from '@angular/core';
import { Product } from '../../models/producto.model';
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
  products = signal<Product[]>([]);
  inStockCount = computed(() => this.products().filter(p => p.inStock).length);

  constructor(
    private productsService: ProductService,
    private carritoService: CarritoService
  ) {
    this.productsService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando XML:', err),
    });
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }
}
