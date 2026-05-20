import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-sala-form',
  standalone: true,
  templateUrl: './forms-sala.html',
  styleUrl: './forms-sala.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class SalaFormComponent implements OnInit {

  salaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SalaFormComponent>,
  ) {}

  ngOnInit(): void {
    this.salaForm = this.fb.group({
      nombre_sala: ['', [Validators.required, Validators.minLength(2)]],
      tipo_sala:   ['', [Validators.required]],
      capacidad:    ['', [Validators.required, Validators.min(1)]],
    });
  }

  guardar(): void {
    if (this.salaForm.invalid) {
      this.salaForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.salaForm.value);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  get nombre_sala() { return this.salaForm.get('nombre_sala'); }
  get tipo_sala()   { return this.salaForm.get('tipo_sala'); }
  get capacidad()    { return this.salaForm.get('capacidad'); }
}