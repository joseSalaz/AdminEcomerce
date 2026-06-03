import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoMasVendido } from '../models/productoMasVendido';

@Injectable({
  providedIn: 'root'
})
export class ProductosMasVendidosService {

  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "DetalleVenta/productos-mas-vendidos";

  constructor(private http: HttpClient) {}

  obtenerProductosMasVendidos(mes: number, anio: number): Observable<ProductoMasVendido[]> {
    return this.http.get<ProductoMasVendido[]>(`${this.apiUrl}?mes=${mes}&anio=${anio}`);
  }
}
