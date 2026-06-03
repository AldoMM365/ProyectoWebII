import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoCardComponent {
  @Input({ required: true }) product!: Producto;
  @Output() add = new EventEmitter<Producto>();

  onAdd() {
    alert(`Agregaste ${this.product.nombre} al carrito`);
    this.add.emit(this.product);
  }
}