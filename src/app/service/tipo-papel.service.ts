import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { TipoPapel } from '../models/tipo_papel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPapelService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "TipoPapel";
  constructor(
    private http : HttpClient
  ) { }
  getTipoPapel(): Observable<TipoPapel[]>{
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
