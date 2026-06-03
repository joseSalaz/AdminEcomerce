import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    private endPoint = environment.endPoint;
    private apiUrl = this.endPoint + "Usuario";
  constructor(private http: HttpClient) {}
  
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/crear`, usuario);
  }
  
  obtenerUsuarios() {
    return this.http.get<any[]>(this.apiUrl);
  }
  update(subcategoria: any) {
    return this.http.put(`${this.apiUrl}`, subcategoria)
  }
  actualizarUsuario(usuario:Usuario){
    return this.http.put(`${this.apiUrl}/actualizar`,usuario)
  }

  cambiarEstadoUsuario(id: number, estadoActual: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-estado/${id}`, estadoActual);
  }
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
