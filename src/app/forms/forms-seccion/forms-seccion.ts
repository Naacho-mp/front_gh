import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-seccion-form',
  standalone: true,
  templateUrl: './forms-seccion.html',
  styleUrl: './forms-seccion.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class SeccionFormComponent implements OnInit {

  seccionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SeccionFormComponent>,
  ) {}

  ngOnInit(): void {
    this.seccionForm = this.fb.group({
      codigo_ramo: ['', [Validators.required, Validators.minLength(2)]],
      numero_seccion:   ['', [Validators.required]],
      estudiantes_inscritos:    ['', [Validators.required, Validators.min(1)]],
    });
  }

  guardar(): void {
    if (this.seccionForm.invalid) {
      this.seccionForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.seccionForm.value);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  get codigo_ramo() { return this.seccionForm.get('codigo_ramo'); }
  get numero_seccion()   { return this.seccionForm.get('numero_seccion'); }
  get estudiantes_inscritos()    { return this.seccionForm.get('estudiantes_inscritos'); }
}