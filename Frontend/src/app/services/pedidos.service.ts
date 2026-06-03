import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface PedidoProducto {
    nombre: string;
    precio: number;
    cantidad: number;
    imagen?: string;
}

export interface Pedido {
    id: number;
    fecha: string;
    estado: string;
    usuario?: string;
    productos: PedidoProducto[];
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/pedidos';

    obtenerPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.apiUrl);
    }

    obtenerPedidosEmpleado(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.apiUrl}/all`);
    }

    actualizarEstadoPedido(id: number, estado: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, { estado });
    }
}
