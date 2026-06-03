import { Component, computed, inject, output } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  name = computed(() => this.authService.getUser()?.nombre);
  cantidad = computed(() => this.carritoService.cantidad());

  constructor(
    private carritoService: CarritoService
  ) {}


  onCartClick() {
    this.toggleCart.emit();
  }

  searchProducts(term: string): void {
    const search = term.trim();
    this.router.navigate(['/'], {
      queryParams: { search: search || null },
      queryParamsHandling: 'merge',
    });
  }

  filterByCategory(category: string | null): void {
    this.router.navigate(['/'], {
      queryParams: { category, search: null },
      queryParamsHandling: 'merge',
    });
  }
}
