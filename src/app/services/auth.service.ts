import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs'; 
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private storageKey = 'usuario_sesion';

  //Creamos el contenedor privado que guardará el estado del usuario 
  private usuarioSubject = new BehaviorSubject<any>(this.obtenerUsuarioDesdeStorage());
  
  // Exponemos el contenedor como un Observable público para que el Navbar se suscriba
  public usuarioActual$: Observable<any> = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  private obtenerUsuarioDesdeStorage(): any {
    const datos = localStorage.getItem(this.storageKey);
    return datos ? JSON.parse(datos) : null;
  }

  login(nombre: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { nombre, contrasena }).pipe(
      tap((respuestaBackend) => {
        this.usuarioSubject.next(respuestaBackend);
        localStorage.setItem(this.storageKey, JSON.stringify(respuestaBackend));
      })
    );
  }

  recuperarContrasena(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/olvidar-contrasena`, { correo });
  }

  restablecerContrasena(tokenrecuperar: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/restablecer-contrasena`, { tokenrecuperar, nuevaContrasena });
  }

  // para cerrar sesion
  logout() {
    this.usuarioSubject.next(null);
    localStorage.removeItem(this.storageKey);
  }
}