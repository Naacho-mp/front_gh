import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink, Router} from '@angular/router';

@Component({
  selector: 'app-recuperar-pass',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperar-pass.html',
  styleUrl: './recuperar-pass.css',
})
export class RecuperarPass {
  correo = '';
  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  recuperarContrasena() {
    this.mensajeExito = '';
    this.mensajeError = '';

    // 1. Validar que no esté vacío
    if (!this.correo.trim()) {
      this.mensajeError = 'Por favor ingrese su correo electrónico.';
      return;
    }

    // 2. Validar formato de correo institucional
    const correoValido = /^[a-zA-Z0-9._%+-]+@ucm\.cl$/.test(this.correo);
    if (!correoValido) {
      this.mensajeError = 'Ingrese un correo institucional válido (@ucm.cl).';
      return;
    }

    // 3. Llamar al servicio
    this.cargando = true;

    // this.authService.recuperarContrasena(this.correo).subscribe({
    //   next: () => {
    //     this.mensajeExito = 'Se enviaron las instrucciones a tu correo.';
    //     this.cargando = false;
    //   },
    //   error: () => {
    //     this.mensajeError = 'No se encontró una cuenta con ese correo.';
    //     this.cargando = false;
    //   }
    // });

    // Simulación mientras no tienes el servicio:
    setTimeout(() => {
      this.mensajeExito = 'Se enviaron las instrucciones a tu correo.';
      this.cargando = false;
    }, 1500);
  }
}