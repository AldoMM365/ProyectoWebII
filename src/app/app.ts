import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CarritoComponent } from './components/carrito.component/carrito.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CarritoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto1');
  protected cartVisible = signal(false);

  toggleCart() {
    this.cartVisible.update(val => !val);
  }
}
