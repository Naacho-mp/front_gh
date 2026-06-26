import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Seccion } from '../../services/seccion.service';
import { RamosService, Ramo } from '../../services/ramo.service';

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
  esEdicion = false
  ramos: Ramo[] = [];
  ramosFiltrados: Ramo[] = [];
  mostrarDropdown = false;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SeccionFormComponent>,
    private ramosService: RamosService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Seccion | null
  ) {}

  ngOnInit(): void {
    this.esEdicion = !!this.data;

    this.seccionForm = this.fb.group({
      codigo_ramo: ['', [Validators.required, Validators.minLength(2)]],
      numero_seccion:   ['', [Validators.required]],
      estudiantes_inscritos:    ['', [Validators.required, Validators.min(1)]],
    });

    if (this.data) {
      this.seccionForm.patchValue({
        codigo_ramo:           this.data.codigo_ramo,
        numero_seccion:        this.data.numero_seccion,
        estudiantes_inscritos: this.data.estudiantes_inscritos
      });
    }

    this.ramosService.getAll().subscribe(ramos => {
    this.ramos = ramos;
    this.ramosFiltrados = ramos; 
  });

  }

  //para filtrar ramos en el select de codigo ramo, y los cargue segun lo que haya en ramos
filtrarRamos(event: Event): void {
  const valor = (event.target as HTMLInputElement).value.toLowerCase();
  
  if (valor.length === 0) {
    this.ramosFiltrados = [];
    this.mostrarDropdown = false;
    return;
  }

  this.ramosFiltrados = this.ramos.filter(r =>
    r.id.toLowerCase().includes(valor) ||
    r.nombre.toLowerCase().includes(valor)
  );

  this.mostrarDropdown = this.ramosFiltrados.length > 0;
}

seleccionarRamo(ramo: Ramo): void {
  this.seccionForm.get('codigo_ramo')?.setValue(ramo.id);
  this.mostrarDropdown = false;
}

ocultarDropdown(): void {
  setTimeout(() => this.mostrarDropdown = false, 150);
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