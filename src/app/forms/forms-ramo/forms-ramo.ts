import { CommonModule } from '@angular/common';
import { Component, OnInit,Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { Ramo } from '../../services/ramo.service';


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
  esEdicion = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RamoFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Ramo | null
  ) {}

  ngOnInit(): void {

    this.esEdicion = !!this.data;

    this.ramoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      nivel: ['', [Validators.required]],
      cantidad_secciones:    ['', [Validators.required, Validators.min(1)]],
      cupos_por_seccion:    ['', [Validators.required, Validators.min(1)]],
      horas_catedra:    ['', [Validators.required, Validators.min(1)]],
      horas_laboratorio:    ['', [Validators.required, Validators.min(1)]],
    });

    if (this.data) {
      this.ramoForm.patchValue({
        nombre:             this.data.nombre,
        nivel:              this.data.nivel,
        cantidad_secciones: this.data.cantidad_secciones,
        cupos_por_seccion:  this.data.cupos_por_seccion,
        horas_catedra:      this.data.horas_catedra,
        horas_laboratorio:  this.data.horas_laboratorio
      });
    }
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

  get nombre() { return this.ramoForm.get('nombre'); }
  get nivel()   { return this.ramoForm.get('nivel'); }
  get cantidad_secciones()    { return this.ramoForm.get('cantidad_secciones'); }
  get cupos_por_seccion()    { return this.ramoForm.get('cupos_por_seccion'); }
  get horas_catedra()    { return this.ramoForm.get('horas_catedra'); }
  get horas_laboratorio()    { return this.ramoForm.get('horas_laboratorio'); }
}