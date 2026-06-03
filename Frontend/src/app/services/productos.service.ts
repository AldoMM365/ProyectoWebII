import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
	private http = inject(HttpClient);
	private url = 'http://localhost:3000/api/products';
	getProducts(): Observable<Producto[]> {
		return this.http.get<Producto[]>(this.url);
	}
}