import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private endPoint = environment.endPoint; 
  private apiUrl = this.endPoint + "Categoria";
  constructor(private http : HttpClient) { }

  
  getCategoriaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl+"/"}${id}`);
  }
}
