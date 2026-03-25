import { Routes } from '@angular/router';
import { Catalogo } from './components/catalogo/catalogo.component';

export const routes: Routes = [
    {path:'', component:Catalogo},
    {path:'carrito', component: Catalogo},
    {path:'**', redirectTo:''},
];
