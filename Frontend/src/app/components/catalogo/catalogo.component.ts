import { Component, computed, signal, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  searchTerm = signal('');
  selectedCategory = signal('');
  filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory().trim().toLowerCase();

    return this.products().filter((product) => {
      const matchesName = !term || product.nombre.toLowerCase().includes(term) || product.descripcion.toLowerCase().includes(term);
      const matchesCategory = !category || product.categoria.toLowerCase() === category;
      return matchesName && matchesCategory;
    });
  });
  inStockCount = computed(() => this.filteredProducts().filter(p => p.stock > 0).length);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor(
    private productsService: ProductService,
    private carritoService: CarritoService
  ) {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.searchTerm.set(params.get('search') ?? '');
      this.selectedCategory.set(params.get('category') ?? '');
    });

    this.productsService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando XML:', err),
    });
  }

  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  clearFilters(): void {
    this.router.navigate(['/']);
  }
}
