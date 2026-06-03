import { Component, computed, inject, output, signal } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { MenuComponent } from './menu/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  toggleCart = output<void>();
  authService = inject(AuthService);
  name = computed(() => this.authService.getUser()?.nombre);
  cantidad = computed(() => this.carritoService.cantidad());

  constructor(
    private carritoService: CarritoService
  ) {}


  onCartClick() {
    this.toggleCart.emit();
  }
}
