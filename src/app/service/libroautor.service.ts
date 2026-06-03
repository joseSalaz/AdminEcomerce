import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibroautorService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "LibroAutor";
  constructor(
    private http :HttpClient
  ) { }

  getAutoresByLibroId(libroId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAutoresByLibroId/${libroId}`);
  }
  
}
