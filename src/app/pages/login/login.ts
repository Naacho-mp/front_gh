import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  usuario = '';
  password = '';
  recordarme = false;
  mostrarPassword = false;
  cargando = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private snackBar: MatSnackBar 
  ) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {

  if (!this.usuario.trim() || !this.password.trim()) {
      this.snackBar.open('Por favor, ingrese su usuario y contraseña.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar'] 
      });
      return;
    }

    this.cargando = true;

    this.authService.login(this.usuario, this.password).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.snackBar.open(`Inicio de sesión exitoso, Bienvenido(a): ${respuesta.usuario.nombre}`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-success'] 
        });
        this.router.navigate(['/horario']); 
      },
      error: (err) => {
        this.cargando = false;
        
        
        const mensaje = err.status === 401 
          ? 'Usuario o contraseña incorrectos' 
          : 'Error de conexión con el servidor. Intente más tarde.';

        
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