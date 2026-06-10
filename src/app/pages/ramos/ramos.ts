import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RamoFormComponent } from '../../forms/forms-ramo/forms-ramo';
import { RamosService, Ramo } from '../../services/ramo.service';
import { ConfirmarDialog } from '../../shared/confirmar-dialog/confirmar-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

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

  // Inyectamos ChangeDetectorRef para forzar el renderizado síncrono
  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ramosService: RamosService,
    private snackBar: MatSnackBar
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
      })).filter(ramo => ramo.nombre !== 'Sin nombre'); // Filtra filas vacías fantasmas

      if (nuevosRamos.length > 0) {
      nuevosRamos.forEach(ramo => this.ramosService.agregar(ramo));
      this.currentPage = 1;
      console.log('Ramos importados con éxito:', nuevosRamos);
      this.cdr.detectChanges();
    }

      // Limpia el input para que permita cargar el mismo archivo consecutivamente si se modifica
      input.value = '';
    };

    lector.readAsBinaryString(archivo);
  }

  
  get ramos(): Ramo[] {
    return this.ramosService.getAll();
  }

  abrirRegistro(): void {
    this.dialog.open(RamoFormComponent, {
      width: '560px',
      disableClose: true,
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.ramosService.agregar(result);
          this.snackBar.open(`El Ramo "${result.nombre}" ha sido registrado correctamente`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snack-success']
          });
        }
      });
    }

  get filtrados(): Ramo[] {
    return this.ramos.filter(r =>
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

  editar(d: Ramo) { console.log('Editar', d); }

  eliminar(d: Ramo): void {
  this.dialog.open(ConfirmarDialog, {
    width: '350px',
    data: {
      titulo: 'ELIMINAR RAMO',
      mensaje: `¿Estás seguro que deseas eliminar el Ramo <strong>"${d.nombre}"</strong>? Esta acción eliminará toda la información asociada a este ramo.`,
      boton: 'Eliminar',
      tipo: 'eliminar'
    }
  }).afterClosed().subscribe(confirmado => {
    if (confirmado === true){
    this.ramosService.eliminar(d.id);
    this.snackBar.open(`El Ramo "${d.nombre}" ha sido eliminado correctamente`, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar']
      });
    }
  });

}
}
