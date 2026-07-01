import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  usuario = '';
  password = '';
  recordarme = false;
  mostrarPassword = false;
  
  // Variables para feedback visual
  cargando = false;
  mensajeError = '';

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {
    this.mensajeError = '';

    if (this.usuario && this.password) {
      this.cargando = true;
      
      this.authService.login(this.usuario, this.password).subscribe({
        next: (respuesta) => {
          this.cargando = false;
          // Aquí podrías guardar el usuario o un token en localStorage
          console.log(respuesta.mensaje);
          this.router.navigate(['/horario']); 
        },
        error: (err) => {
          this.cargando = false;
          // Mostrar el error que devuelve el backend o uno genérico
          this.mensajeError = err.error?.error || 'Error de conexión con el servidor';
        }
      });
    } else {
      this.mensajeError = 'Por favor, ingrese sus credenciales completas.';
    }
  }
}