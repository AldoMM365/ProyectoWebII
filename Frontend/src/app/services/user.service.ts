import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UpdateProfilePayload {
  nombre: string;
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/users';

  updateProfile(payload: UpdateProfilePayload): Observable<any> {
    return this.http.put(this.apiUrl, payload);
  }

  changePassword(payload: ChangePasswordPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/changePassword`, payload);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}