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
    this.add.emit(this.product);
  }
}