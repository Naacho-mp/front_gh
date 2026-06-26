import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sala } from '../../services/sala.service';


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
  esEdicion = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SalaFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Sala | null
  ) {}

  ngOnInit(): void {
    this.esEdicion = !!this.data;

    this.salaForm = this.fb.group({
      nombre:    ['', [Validators.required, Validators.minLength(2), Validators.pattern('^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+$')]],
      tipo:      ['', [Validators.required]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
    });
    if (this.data) {
      this.salaForm.patchValue({
        nombre:    this.data.nombre,
        tipo:      this.data.tipo,
        capacidad: this.data.capacidad
      });
    }
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

  get nombre()    { return this.salaForm.get('nombre'); }
  get tipo()      { return this.salaForm.get('tipo'); }
  get capacidad() { return this.salaForm.get('capacidad'); }
}