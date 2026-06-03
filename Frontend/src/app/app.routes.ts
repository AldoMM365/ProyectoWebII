import { Routes } from '@angular/router';
import { Catalogo } from './components/catalogo/catalogo.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path:'',
        component: Catalogo
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'registro',
        loadComponent: () => import('./components/register/register.component').then((m) => m.RegisterComponent)
    },
    {
        path:'checkout',
        canActivate: [authGuard],
        loadComponent: () => import('./components/checkout/checkout.component').then((m) => m.CheckoutComponent)
    },
    {
        path:'pedidos',
        canActivate: [authGuard],
        component: PedidosComponent
    },
    {
        path:'**',
        redirectTo:''
    },
];
