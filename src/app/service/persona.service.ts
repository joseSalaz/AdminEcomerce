import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Persona } from '../models/persona';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "Persona";
  constructor(private http: HttpClient) {}

  buscarPorNombre(nombre: string) {
    return this.http.get<any[]>(`${this.apiUrl}/buscar/${nombre}`);
  }

  crearPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}`, persona);
  }
  
  getbyId(id: number) : Observable<any>{
    return this.http.get(`${this.apiUrl}/${id}`)
  }
}
