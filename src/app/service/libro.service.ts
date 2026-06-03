import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Libro } from '../models/libro';
import { map, Observable } from 'rxjs';
import { Precio } from '../models/precio';
import { Kardex } from '../models/kardex';
import { Libroconautor } from '../models/libroConAutor';




@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "Libro";
  

  constructor(
    private http : HttpClient
  ) { }

  getList(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}`);
  }
  // updateLibro(libro: Libro, precioVenta: number, stock: number) {
  //   return this.http.put<Libro>(`${this.apiUrl}?precioVenta=${precioVenta}&stock=${stock}`, libro, {
  //     headers: {
  //       'Content-Type': 'application/json'  // Asegúrate de que el encabezado es JSON
  //     }
  //   });
  // }

  getPaginatedLibros(page: number, pageSize: number): Observable<Libro[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
      
    return this.http.get<any>(this.apiUrl + "/Paginator", { params }).pipe(
      map(response => response.libros) 
    );
  }
  getPrecioById(id: number): Observable<Precio> {
    return this.http.get<Precio>(`${this.apiUrl}/precios/${id}`);
  }
  
  getStockById(id: number): Observable<Kardex> {
    return this.http.get<Kardex>(`${this.apiUrl}/kardex/${id}`);
  }
  
  createLibro(formData: FormData, precioVenta: number, stock: number): Observable<any> {
    const url = `${this.apiUrl}/create-with-image-firebase?precioVenta=${precioVenta}&stock=${stock}`;
    return this.http.post(url, formData);
  }
  


  updateLibro(formData: FormData, precioVenta: number, stock: number): Observable<any> {
    // Realizar la petición PUT al backend, pasando los parámetros precioVenta y stock en la URL
    return this.http.put(`${this.apiUrl}?precioVenta=${precioVenta}&stock=${stock}`, formData);
  }
  
  updateestado(id:number){
    return this.http.put(`${this.apiUrl}/cambiar-estado/${id}`,id)
  }

  filtrarLibros(estado?: boolean, titulo?: string, page: number = 1, pageSize: number = 10): Observable<any> {
    let params: any = { page, pageSize };
  
    if (estado !== undefined) {
      params.estado = estado;
    }
    if (titulo) {
      params.titulo = titulo;
    }
  
    return this.http.get<any>(`${this.apiUrl}/filtrar`, { params });
  }
  
}
