import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  diasSemana = [
    { id: 'lunes', nombre: 'Lunes', abreviacion: 'Lun' },
    { id: 'martes', nombre: 'Martes', abreviacion: 'Mar' },
    { id: 'miercoles', nombre: 'Miércoles', abreviacion: 'Mier' },
    { id: 'jueves', nombre: 'Jueves', abreviacion: 'Jue' },
    { id: 'viernes', nombre: 'Viernes', abreviacion: 'Vie' },
    { id: 'sabado', nombre: 'Sábado', abreviacion: 'Sab' }
  ];


  modulosHorarios = [
    { id: '1', rango: '08:30 - 09:30' }, { id: '2', rango: '09:35 - 10:35' },
    { id: '3', rango: '10:50 - 11:50' }, { id: '4', rango: '11:55 - 12:55' },
    { id: '5', rango: '13:10 - 14:10' }, { id: '6', rango: '14:30 - 15:30' },
    { id: '7', rango: '15:35 - 16:35' }, { id: '8', rango: '16:50 - 17:50' },
    { id: '9', rango: '17:55 - 18:55' }, { id: '10', rango: '19:10 - 20:10' },
    { id: '11', rango: '20:15 - 21:15' }, { id: '12', rango: '21:20 - 22:20' }
  ];

 
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocenteFormComponent>
  ) {}

  ngOnInit(): void {
    this.docenteForm = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(2)]],
      tipo_contrato:   ['', [Validators.required]],
      matrizDisponibilidad: this.fb.array([])
    });
      this.inicializarMatriz();


    this.docenteForm.get('tipo_contrato')?.valueChanges.subscribe(value => {
    if (value !== 'part-time') {
      this.docenteForm.get('matrizDisponibilidad')?.reset();
    }
  });

  }

  inicializarMatriz() {
    const matriz = this.docenteForm.get('matrizDisponibilidad') as FormArray;
    
    // 6 FormArrays para cada dia de la semana
    for (let d = 0; d < this.diasSemana.length; d++) {
      const filaModulos = this.fb.array([]);
      // Cada día con 12 controles booleanos (uno por módulo)
      for (let m = 0; m < this.modulosHorarios.length; m++) {
        filaModulos.push(this.fb.control(false));
      }
      matriz.push(filaModulos);
    }
  }

  get filasDias(): FormArray {
    return this.docenteForm.get('matrizDisponibilidad') as FormArray;
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