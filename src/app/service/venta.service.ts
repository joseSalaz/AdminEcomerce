import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IngresoMensual } from '../models/IngresoMensual';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "Venta";
  constructor(private http: HttpClient) { }
  obtenerIngresosMensuales(fechaInicio: string, fechaFin: string): Observable<IngresoMensual[]> {
    return this.http.get<IngresoMensual[]>(`${this.apiUrl}/ingresos-mensuales?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  obtenerVentasPorMes(anio: number, mes: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-mes?anio=${anio}&mes=${mes}`);
  }

  generarReporteExcel(anio: number, mes: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reporte-excel?anio=${anio}&mes=${mes}`, {
      responseType: 'blob' // Indicar que la respuesta es un archivo
    });
  }
}
