import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {
    // Aquí conectas con tu backend
    if (this.usuario && this.password) {
      this.router.navigate(['/horario']); 
    }
  }
}