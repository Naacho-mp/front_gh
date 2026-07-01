import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-recuperar-pass',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperar-pass.html',
  styleUrl: './recuperar-pass.css',
})
export class RecuperarPass {
  // Control de flujo de las pantallas
  paso = 1; 
  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  // Variables Paso 1 (Correo)
  correo = '';

  // Variables Paso 2 (Código y nueva contraseña)
  tokenrecuperar = '';
  nuevaContrasena = '';
  mostrarPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // PASO 1: Enviar correo institucional
  recuperarContrasena() {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (!this.correo.trim()) {
      this.mensajeError = 'Por favor ingrese su correo electrónico.';
      return;
    }

    // Cambiamos de pantalla de inmediato, sin esperar la respuesta del servidor.
    // El envío del correo se sigue procesando en segundo plano.
    this.paso = 2;

    this.authService.recuperarContrasena(this.correo).pipe(
      timeout(15000), // Si el backend no responde en 15s, se avisa igual (en segundo plano)
      catchError(err => {
        if (err.name === 'TimeoutError') {
          this.mensajeError = 'El servidor está tardando demasiado en responder. Es posible que el correo no haya sido enviado; puedes intentar solicitarlo nuevamente.';
        } else {
          this.mensajeError = err.error?.error || 'No se encontró una cuenta con ese correo o hubo un problema al enviar el código.';
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: (respuesta) => {
        this.mensajeExito = '¡Correo enviado con éxito! Revisa tu bandeja de entrada.';
      },
      error: () => {
        // El mensaje de error ya se seteó en catchError; aquí solo evitamos
        // que la excepción quede sin manejar en la consola.
      }
    });
  }

  // PASO 2: Validar token y actualizar clave
  actualizarContrasena() {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (!this.tokenrecuperar.trim() || !this.nuevaContrasena.trim()) {
      this.mensajeError = 'El código y la nueva contraseña son requeridos.';
      return;
    }

    this.cargando = true;

    this.authService.restablecerContrasena(this.tokenrecuperar, this.nuevaContrasena).pipe(
      timeout(15000),
      catchError(err => {
        this.cargando = false;
        if (err.name === 'TimeoutError') {
          this.mensajeError = 'El servidor está tardando demasiado en responder. Intenta nuevamente.';
        } else {
          this.mensajeError = err.error?.error || 'El código es inválido o ya expiró.';
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.mensajeExito = 'Contraseña actualizada exitosamente. Redirigiendo...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
      }
    });
  }
}