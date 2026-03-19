import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {Product} from '../models/producto.model';

@Injectable ({providedIn:'root'})
export class ProductService{
	constructor(private http:HttpClient){}
	/*private readonly products: Product[] = [
		{
			id: 1,
			name: 'Audifonos',
			price: 599,
			imageUrl: 'ruta_imagen.jpg',
			category: 'Audio',
			description: 'Audifonos inalámbricos',
			inStock: true
		},
		{
			id: 2,
			name: 'Teclado',
			price: 599,
			imageUrl: 'teclado_imagen.jpg',
			category: 'Dispositivos de entrada',
			description: 'Teclado mecánico',
			inStock: true
		},
		{
			id: 3,
			name: 'Micrófono',
			price: 599,
			imageUrl: 'microfono_imagen.jpg',
			category: 'Audio',
			description: 'Micrófono alámbrico HD',
			inStock: false
		}
	];*/
	getAll():Observable<Product[]>{
		return this.http.get('./productos.xml', {responseType: 'text'}).pipe(
			map((xmlText) => this.parseProductsXml(xmlText))
		)
	}
	private parseProductsXml(xmlText: string): Product[]{
		const parser = new DOMParser();
		const doc = parser.parseFromString(xmlText, 'application/xml');
		if (doc.getElementsByTagName('parsererror').length > 0){
			return [];
		}
		const nodes = Array.from(doc.getElementsByTagName('product'));
		return nodes.map((node)=>({
			id: this.getText(node, 'id'),
			name: this.getText(node, 'name'),
			price: this.getNumber(node, 'price'),
			imageUrl: this.getText(node, 'imageUrl'),
			category: this.getText(node, 'category'),
			description: this.getText(node, 'description'),
			inStock: this.getBoolean(node, 'inStock')
		}));
	}
	private getText(parent: Element, tag: string):string {
		return parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
	}
	private getNumber(parent: Element, tag: string):number {
		const value = this.getText(parent, tag);
		const n = Number(value);
		return Number.isFinite(n) ? n : 0; 
	}
	private getBoolean(parent: Element, tag: string): boolean {
		const value = this.getText(parent, tag).toLowerCase();
		return value === 'true' || value === '1' || value === 'yes';
	}
}