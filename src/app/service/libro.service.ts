import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Libro } from '../models/libro';
import { map, Observable } from 'rxjs';
import { Precio } from '../models/precio';
import { Kardex } from '../models/kardex';

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
  updateLibro(libro: Libro) {
    return this.http.put<Libro>(`${this.apiUrl}`, libro, {
      headers: {
        'Content-Type': 'application/json'  // Asegúrate de que el encabezado es JSON
      }
    });
  }

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
  
  createLibro(libro: Libro, imageFile: File, precioVenta: number, stock: number ): Observable<any> {
    const formData = new FormData();
    
    // Agregar los campos del libro al FormData
    formData.append('titulo', libro.titulo || '');
    formData.append('isbn', libro.isbn?.toString() || '');
    formData.append('tamanno', libro.tamanno || '');
    formData.append('descripcion', libro.descripcion || '');
    formData.append('condicion', libro.condicion || '');
    formData.append('impresion', libro.impresion || '');
    formData.append('tipoTapa', libro.tipoTapa || '');
    formData.append('estado', libro.estado?.toString() || 'true');
    formData.append('idSubcategoria', libro.idSubcategoria.toString());
    formData.append('idTipoPapel', libro.idTipoPapel.toString());
    formData.append('idProveedor', libro.idProveedor.toString());
  
    
    // Agregar el archivo de imagen al FormData
    if (imageFile) {
        formData.append('imageFile', imageFile, imageFile.name);
    }

    // Enviar los datos al backend
    return this.http.post(`${this.apiUrl}/create-with-image-firebase?precioVenta=${precioVenta}&stock=${stock}`, formData);
}
}
