import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
@Component({
  selector: 'app-recuperar-pass',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatSnackBarModule], 
  templateUrl: './recuperar-pass.html',
  styleUrl: './recuperar-pass.css',
})
export class RecuperarPass {
  paso = 1; 
  cargando = false;
  correo = '';
  tokenrecuperar = '';
  nuevaContrasena = '';
  mostrarPassword = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // ================= PASO 1: SOLICITAR CÓDIGO =================
  recuperarContrasena() {
    if (!this.correo || !this.correo.trim()) {
      this.snackBar.open('Por favor, ingrese su correo electrónico.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar']
      });
      return; 
    }

    // Si pasó los dos pasos se inicia la peticiion
    this.cargando = true;

    this.authService.recuperarContrasena(this.correo).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.paso = 2;
        this.cdr.detectChanges();
        
        this.snackBar.open('¡Código enviado! Revisa tu correo.', 'Aceptar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-success']
        });

         
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.detectChanges();
        const mensaje = err.error?.error || 'No se encontró una cuenta asociada a este correo.';
        
        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-eliminar']
        });
        
      }
    });
  }

  // ================= PASO 2: RESTABLECER CLAVE =================
  actualizarContrasena() {
    if (!this.tokenrecuperar.trim() || !this.nuevaContrasena.trim()) {
      this.snackBar.open('El código y la nueva contraseña son requeridos.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar']
      });
      return;
    }

    this.cargando = true;

    this.authService.restablecerContrasena(this.tokenrecuperar, this.nuevaContrasena).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.snackBar.open('Contraseña actualizada con éxito. Redirigiendo...', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-success']
        });
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.cargando = false;
        const mensaje = err.error?.error || 'El código es inválido o ya expiró.';
        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-eliminar']
        });
      }
    });
  }
}