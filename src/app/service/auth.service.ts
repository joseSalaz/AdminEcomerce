import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private endPoint = environment.endPoint;
    private apiUrl = this.endPoint + "api/Auth";

    constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap((response: { success: any; token: string; usuario: any; }) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento
    localStorage.removeItem('user');  // Opcional: Elimina la info del usuario
    sessionStorage.clear();           // Limpia todo el sessionStorage
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
