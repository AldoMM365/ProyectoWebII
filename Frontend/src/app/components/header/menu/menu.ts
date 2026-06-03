import {Component, inject, viewChild} from '@angular/core';
import {Menu, MenuContent, MenuItem, MenuTrigger} from '@angular/aria/menu';
import {OverlayModule} from '@angular/cdk/overlay';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'options-menu',
  templateUrl: 'menu.html',
  styleUrl: 'menu.css',
  imports: [Menu, MenuContent, MenuItem, MenuTrigger, OverlayModule],
})
export class MenuComponent {
  formatMenu = viewChild<Menu<string>>('formatMenu');
  categorizeMenu = viewChild<Menu<string>>('categorizeMenu');
  router = inject(Router);
  private authService = inject(AuthService);
  onLogoutClick() {
    this.authService.logout();
  }
  onPedidosClick() {
    this.router.navigate(['/pedidos']);
  }
}