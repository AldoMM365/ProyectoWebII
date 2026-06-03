import { inject, Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router);
    private apiUrl = 'http://localhost:3000/api/auth';
    constructor(private http:HttpClient, @Inject(PLATFORM_ID) private platformId: Object){}
    
    
    login(email: string, password: string): Observable<any>{
        return this.http.post(`${this.apiUrl}/login`, {email, password});
    }
    register(email: string, password: string, name: string): Observable<any>{
        return this.http.post(`${this.apiUrl}/register`, {email, password, name});
    }
    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }
    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) return localStorage.getItem('token');
        return null;
    }
    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }
    isLoggedIn(): boolean {
        return !! this.getToken();
    }
    hasRole(role: string): boolean{
        const token = this.getToken();
        if (!token) return false;
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload:', payload);
        return payload.rol === role;
    }
    getUser(): User | null {
        const token = this.getToken();
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload:', payload);
        return {
            email: payload.email,
            rol: payload.rol,
            id: payload.id,
            nombre: payload.nombre
        };
    }
}