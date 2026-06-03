import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Autor } from '../models/autor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "Autor";

  constructor(private http: HttpClient) {}

  // Buscar autor por nombre o algún otro criterio
  searchAutor(nombre: string): Observable<any> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<any>(`${this.apiUrl}/GetByName`, { params });
  }

  // Crear un nuevo autor
  createAutor(autor: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, autor);
  }

  getAutores():Observable<Autor[]>{
    return this.http.get<any>(`${this.apiUrl}`)
  }
}
