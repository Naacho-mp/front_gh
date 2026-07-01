import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(nombre: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { nombre, contrasena });
  }

  recuperarContrasena(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/olvidar-contrasena`, { correo });
  }

  restablecerContrasena(tokenrecuperar: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/restablecer-contrasena`, { tokenrecuperar, nuevaContrasena });
  }
}