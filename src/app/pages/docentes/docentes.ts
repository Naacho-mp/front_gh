import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DocenteFormComponent } from '../../forms/forms-docente/forms-docente';
import { DocenteService } from '../../services/docente.service';
import * as XLSX from 'xlsx';

interface Docente {
  id: string;
  nombre: string;
  contrato: 'Full-time' | 'Part-time';
}

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './docentes.html',
  styleUrl: './docentes.css',
})
export class Docentes {
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;
  estadoModal: boolean = false;

  docentes: Docente[] = [
    { id: '#DOC-1001', nombre: 'Ricardo Aranda', contrato: 'Full-time' },
    { id: '#DOC-1002', nombre: 'Elena Martínez', contrato: 'Part-time' },
    { id: '#DOC-1003', nombre: 'Julio Paredes', contrato: 'Full-time' },
    { id: '#DOC-1004', nombre: 'Sofía Vargas', contrato: 'Full-time' },
    { id: '#DOC-1005', nombre: 'Andrés Rojas', contrato: 'Part-time' },
    { id: '#DOC-1006', nombre: 'Camila Torres', contrato: 'Full-time' },
    { id: '#DOC-1007', nombre: 'Felipe Muñoz', contrato: 'Part-time' },
    { id: '#DOC-1008', nombre: 'Valentina Soto', contrato: 'Full-time' },
    { id: '#DOC-1009', nombre: 'Diego Fuentes', contrato: 'Part-time' },
    { id: '#DOC-1010', nombre: 'Isabel Herrera', contrato: 'Full-time' },
    { id: '#DOC-1011', nombre: 'Matías Castillo', contrato: 'Part-time' },
    { id: '#DOC-1012', nombre: 'Gabriela Reyes', contrato: 'Full-time' },
  ];

  mostrarModalImportar = false;
  archivoSeleccionado: File | null = null;

  // Inyectamos ChangeDetectorRef para controlar la asincronía del FileReader
  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Getters para calcular dinámicamente las métricas de la cabecera
  get totalDocentes(): number { return this.docentes.length; }
  get totalFullTime(): number { return this.docentes.filter(d => d.contrato === 'Full-time').length; }
  get totalPartTime(): number { return this.docentes.filter(d => d.contrato === 'Part-time').length; }

  abrirRegistro(): void {
    const dialogRef = this.dialog.open(DocenteFormComponent, {
      width: '560px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Docente guardado:', result);
        const nuevoDocente: Docente = {
          id: `#DOC-${Math.floor(Math.random() * 9000 + 1000)}`,
          nombre: result.nombre_docente || result.nombre,
          contrato: result.contrato
        };
        this.docentes = [nuevoDocente, ...this.docentes];
        this.cdr.detectChanges();
      }
    });
  }

  get filtrados(): Docente[] {
    return this.docentes.filter(d =>
      d.nombre.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || d.contrato === this.filterType)
    );
  }

  get paginados(): Docente[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filtrados.slice(start, start + this.perPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtrados.length / this.perPage));
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilter() { this.currentPage = 1; }

  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  disponibilidad(s: Docente) { console.log('Consultando disponibilidad de:', s.nombre); }
  editar(d: Docente) { console.log('Editar', d); }

  eliminar(d: Docente) {
    console.log('Eliminar', d);
    this.docentes = this.docentes.filter(doc => doc.id !== d.id);
    this.cdr.detectChanges();
  }

  // Gestión de carga física del archivo en memoria temporal
  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  // Procesa el binario al presionar el botón "Subir" del modal
  subir(): void {
    if (!this.archivoSeleccionado) return;

    const lector = new FileReader();

    lector.onload = (e: ProgressEvent<FileReader>) => {
      const target = e.target;
      if (!target || !target.result) return;

      const datosBinarios = target.result;
      const libro = XLSX.read(datosBinarios, { type: 'binary' });
      const primeraHojaNombre = libro.SheetNames[0];
      const hoja = libro.Sheets[primeraHojaNombre];

      // Convertimos la hoja a filas de objetos JSON
      const filasRaw = XLSX.utils.sheet_to_json<any>(hoja);

      // Normalizamos y mapeamos las celdas al modelo estricto Docente
      const nuevosDocentes: Docente[] = filasRaw.map(fila => {
        // Validación del formato de contrato para evitar romper el tipado literal
        let tipoContrato: 'Full-time' | 'Part-time' = 'Full-time';
        const contratoRaw = String(fila['Tipo de contrato'] || fila['contrato'] || '').trim();
        if (contratoRaw.toLowerCase().includes('part')) {
          tipoContrato = 'Part-time';
        }

        return {
          id: String(fila['ID Docente'] || fila['id'] || '').trim(),
          nombre: String(fila['Nombre del docente'] || fila['nombre'] || 'Docente sin nombre').trim(),
          contrato: tipoContrato
        };
      }).filter(doc => doc.id !== ''); // Removemos filas vacías o corruptas

      if (nuevosDocentes.length > 0) {
        // Concatenamos de forma inmutable los nuevos docentes
        this.docentes = [...this.docentes, ...nuevosDocentes];
        this.currentPage = 1;
        console.log('Docentes importados con éxito:', nuevosDocentes);

        // Sincronizamos los cambios asíncronos con el árbol DOM de Angular de inmediato
        this.cdr.detectChanges();
      }

      // Limpieza final de estados del modal
      this.mostrarModalImportar = false;
      this.archivoSeleccionado = null;
    };

    lector.readAsBinaryString(this.archivoSeleccionado);
  }
}
