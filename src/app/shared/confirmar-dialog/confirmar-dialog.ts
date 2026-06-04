import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './confirmar-dialog.html',
  styleUrl: './confirmar-dialog.css'
})
export class ConfirmarDialog {
  color: string;

  constructor(
    public respuesta: MatDialogRef<ConfirmarDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string; boton: string; tipo: 'eliminar' | 'editar' }
  ) {
    this.color = data.tipo === 'eliminar' ? '#dc3545' : '#0d6efd';
  }
}