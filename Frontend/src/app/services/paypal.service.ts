import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PaypalService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/paypal';

    crearOrden(data: {
        items: {
            nombre: string;
            precio: number;
            cantidad: number
        }[];
        total: number;
    }): Observable<{ id: string, status: string, pedido: string}> {
        return this.http.post<{id: string; status:string, pedido: string}>(`${this.apiUrl}/create-order`, data);
    }

    capturarOrden(orderId: string, pedido: string): Observable<{ status: string }> {
        console.log('Capturando orden con ID:', orderId, 'y pedido:', pedido);
        return this.http.post<{status: string}>(`${this.apiUrl}/capture-order`, { orderId, pedido });
    }
}