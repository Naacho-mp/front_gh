import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-docente-form',
  standalone: true,
  templateUrl: './forms-docente.html',
  styleUrl: './forms-docente.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class DocenteFormComponent implements OnInit {

  docenteForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocenteFormComponent>
  ) {}

  ngOnInit(): void {
    this.docenteForm = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(2)]],
      tipo_contrato:   ['', [Validators.required]],
    });
  }

  guardar(): void {
    if (this.docenteForm.invalid) {
      this.docenteForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.docenteForm.value);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  get nombre_completo() { return this.docenteForm.get('nombre_completo'); }
  get tipo_contrato()   { return this.docenteForm.get('tipo_contrato'); }
}