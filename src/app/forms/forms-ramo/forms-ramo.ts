import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-ramo-form',
  standalone: true,
  templateUrl: './forms-ramo.html',
  styleUrl: './forms-ramo.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class RamoFormComponent implements OnInit {

  ramoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RamoFormComponent>,
  ) {}

  ngOnInit(): void {
    this.ramoForm = this.fb.group({
      nombre_ramo: ['', [Validators.required, Validators.minLength(2)]],
      nivel: ['', [Validators.required]],
      cantidad_secciones:    ['', [Validators.required, Validators.min(1)]],
      cupos_seccion:    ['', [Validators.required, Validators.min(1)]],
      horas_catedra:    ['', [Validators.required, Validators.min(1)]],
      horas_laboratorio:    ['', [Validators.required, Validators.min(1)]],
    });
  }

  guardar(): void {
    if (this.ramoForm.invalid) {
      this.ramoForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.ramoForm.value);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  get nombre_ramo() { return this.ramoForm.get('nombre_ramo'); }
  get nivel()   { return this.ramoForm.get('nivel'); }
  get cantidad_secciones()    { return this.ramoForm.get('cantidad_secciones'); }
  get cupos_seccion()    { return this.ramoForm.get('cupos_seccion'); }
  get horas_catedra()    { return this.ramoForm.get('horas_catedra'); }
  get horas_laboratorio()    { return this.ramoForm.get('horas_laboratorio'); }
}