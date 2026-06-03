import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { environment } from '../environments/environments';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class CriptoService {
  textoEncriptadoOriginal: string | null = null;
  passwordDesencriptada: string | null = null;
  mostrarPassword = false;
  @Input() usuario: Partial<Usuario> = {};  // ✅ ESTA ES LA CORRECTA (DEJARLA)
  constructor(private http: HttpClient) { }

  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + "api/Cripto/desencriptar";



  desencriptarPassword(passwordEncriptado: string) {
    const body = {
      EncryptedText: passwordEncriptado
    };
    return this.http.post<{ decryptedText: string }>(
      `${this.apiUrl}`,
      body
    );
  }
}
