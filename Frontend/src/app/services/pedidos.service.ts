import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface PedidoProducto {
    nombre: string;
    precio: number;
    imagen?: string;
}

export interface Pedido {
    id: number;
    fecha: string;
    estado: string;
    productos: PedidoProducto[];
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/pedidos';

    obtenerPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.apiUrl);
    }
}
