import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provedor } from '../models/provedor';

@Injectable({
  providedIn: 'root'
})
export class ProvedorService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "Proveedor";
  constructor(
    private http : HttpClient
  ) { }
  getProveedor(): Observable<Provedor[]>{
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
