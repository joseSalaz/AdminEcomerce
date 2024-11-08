import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SubCategoria} from '../models/subcategoria';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "Subcategoria";
  private apicateUrl = this.endPoint+ "Categoria";

  constructor(
    private http:HttpClient
  ) { }

  getList(): Observable<SubCategoria[]>{
    return this.http.get<SubCategoria[]>(`${this.apiUrl}`);
  }
  getCategoriaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apicateUrl}${id}`);
  }
}
