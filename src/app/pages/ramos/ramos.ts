import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RamoFormComponent } from '../../forms/forms-ramo/forms-ramo';
import * as XLSX from 'xlsx';

interface Ramo {
  id: string;
  nombre: string;
  nivel: string;
  cantidad_secciones: number;
  cupos_por_seccion: number;
  horas_catedra: number;
  horas_laboratorio: number;
}

@Component({
  selector: 'app-ramos',
  imports: [CommonModule, FormsModule],
  templateUrl: './ramos.html',
  styleUrl: './ramos.css',
})
export class Ramos {
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;

  salas: Ramo[] = [
    { id: '#INF-201', nombre: 'Introducción a la Programación', nivel: 'II', cantidad_secciones: 2, cupos_por_seccion: 15, horas_catedra: 4, horas_laboratorio: 4 },
    { id: '#ECI-302', nombre: 'Matemáticas', nivel: 'I', cantidad_secciones: 3, cupos_por_seccion: 20, horas_catedra: 4, horas_laboratorio: 4 },
    { id: '#ECI-102', nombre: 'Taller Software', nivel: 'III', cantidad_secciones: 2, cupos_por_seccion: 15, horas_catedra: 5, horas_laboratorio: 4 },
    { id: '#INE-202', nombre: 'Apps Móviles', nivel: 'II', cantidad_secciones: 1, cupos_por_seccion: 30, horas_catedra: 4, horas_laboratorio: 2 },
    { id: '#ECI-135', nombre: 'Cloud', nivel: 'I', cantidad_secciones: 1, cupos_por_seccion: 25, horas_catedra: 4, horas_laboratorio: 3 },
  ];

  // Inyectamos ChangeDetectorRef para forzar el renderizado síncrono
  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Maneja la carga e interpretación del documento Excel
  leerExcel(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];
    const lector = new FileReader();

    lector.onload = (e: ProgressEvent<FileReader>) => {
      const target = e.target;
      if (!target || !target.result) return;

      const datosBinarios = target.result;
      const libro = XLSX.read(datosBinarios, { type: 'binary' });
      const primeraHojaNombre = libro.SheetNames[0];
      const hoja = libro.Sheets[primeraHojaNombre];

      // Convertimos el contenido de la primera pestaña en un arreglo JSON
      const filasRaw = XLSX.utils.sheet_to_json<any>(hoja);

      // Normalizamos y mapeamos los nombres de las columnas en español al objeto Ramo
      const nuevosRamos: Ramo[] = filasRaw.map(fila => ({
        id: String(fila['Código Ramo'] || fila['codigo'] || '').trim(),
        nombre: String(fila['Nombre Ramo'] || fila['nombre'] || 'Sin nombre').trim(),
        nivel: String(fila['Nivel'] || fila['nivel'] || 'I').trim(),
        cantidad_secciones: Number(fila['Cantidad Secciones'] || fila['Cantidad de Secciones'] || 0),
        cupos_por_seccion: Number(fila['Cupos Sección'] || fila['Cupos por Sección'] || 0),
        horas_catedra: Number(fila['Horas Cátedra'] || 0),
        horas_laboratorio: Number(fila['Horas Laboratorio'] || 0)
      })).filter(ramo => ramo.id !== ''); // Filtra filas vacías fantasmas

      if (nuevosRamos.length > 0) {
        // Añadimos los ramos recuperados al estado reactivo local
        this.salas = [...this.salas, ...nuevosRamos];
        this.currentPage = 1; // Reseteamos la paginación para ver la primera página
        console.log('Ramos importados con éxito:', nuevosRamos);

        // OBLIGATORIO: Notificamos a Angular del cambio asíncrono para actualizar el DOM inmediatamente
        this.cdr.detectChanges();
      }

      // Limpia el input para que permita cargar el mismo archivo consecutivamente si se modifica
      input.value = '';
    };

    lector.readAsBinaryString(archivo);
  }

  abrirRegistro(): void {
    const dialogRef = this.dialog.open(RamoFormComponent, {
      width: '560px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Ramo guardado desde formulario:', result);
        const nuevoRamo: Ramo = {
          id: `#RAMO-${Math.floor(Math.random() * 1000)}`,
          nombre: result.nombre_ramo,
          nivel: result.nivel,
          cantidad_secciones: Number(result.cantidad_secciones),
          cupos_por_seccion: Number(result.cupos_seccion),
          horas_catedra: Number(result.horas_catedra),
          horas_laboratorio: Number(result.horas_laboratorio)
        };
        this.salas = [nuevoRamo, ...this.salas];
        this.cdr.detectChanges(); // Aseguramos renderizado si el diálogo cierra fuera del ciclo principal
      }
    });
  }

  get filtrados(): Ramo[] {
    return this.salas.filter(r =>
      r.nombre.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || r.nivel === this.filterType)
    );
  }

  get paginados(): Ramo[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filtrados.slice(start, start + this.perPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtrados.length / this.perPage));
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilter() {
    this.currentPage = 1;
  }

  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  disponibilidad(s: Ramo) {
    console.log('Consultando disponibilidad de:', s.nombre);
  }

  editar(d: Ramo) {
    console.log('Editar ramo:', d);
  }

  eliminar(d: Ramo) {
    console.log('Eliminar ramo:', d);
    this.salas = this.salas.filter(r => r.id !== d.id);
    this.cdr.detectChanges(); // Forzamos actualización al eliminar
  }
}
