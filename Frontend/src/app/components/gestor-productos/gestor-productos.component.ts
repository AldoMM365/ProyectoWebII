import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { ProductService } from '../../services/productos.service';

@Component({
  selector: 'app-gestor-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestor-productos.component.html',
  styleUrl: './gestor-productos.component.css',
})
export class GestorProductosComponent {
  products: Producto[] = [];
  selectedId: number | null = null;
  loading = true;
  error = '';
  successMessage = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      sku: ['', Validators.required],
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagen: ['', Validators.required],
    });

    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      },
    });
  }

  startNew(): void {
    this.selectedId = null;
    this.successMessage = '';
    this.error = '';
    this.form.reset({ sku: '', nombre: '', categoria: '', precio: 0, descripcion: '', stock: 0, imagen: '' });
  }

  editProduct(product: Producto): void {
    this.selectedId = product.id ?? null;
    this.successMessage = '';
    this.error = '';
    this.form.setValue({
      sku: product.sku,
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      descripcion: product.descripcion,
      stock: product.stock,
      imagen: product.imagen,
    });
  }

  saveProduct(): void {
    this.error = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Producto = {
      ...this.form.value,
      id: this.selectedId ?? undefined,
    };

    const request$ = this.selectedId
      ? this.productService.updateProduct(payload)
      : this.productService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.successMessage = this.selectedId ? 'Producto actualizado con éxito.' : 'Producto agregado con éxito.';
        this.startNew();
        this.loadProducts();
      },
      error: (err) => {
        this.error = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el producto.';
      },
    });
  }

  removeProduct(product: Producto): void {
    const confirmDelete = window.confirm(`¿Eliminar ${product.nombre}?`);
    if (!confirmDelete || product.id == null) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado con éxito.';
        this.loadProducts();
        if (this.selectedId === product.id) {
          this.startNew();
        }
      },
      error: (err) => {
        this.error = err?.error?.error || err?.error?.mensaje || 'No se pudo eliminar el producto.';
      },
    });
  }
}