import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RamoFormComponent } from '../../forms/forms-ramo/forms-ramo';
import { RamosService, Ramo } from '../../services/ramo.service';
import { ConfirmarDialog } from '../../shared/confirmar-dialog/confirmar-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// interface Ramo {
//   id: string;
//   nombre: string;
//   nivel:string;
//   cantidad_secciones: number;
//   cupos_por_seccion: number;
//   horas_catedra: number;
//   horas_laboratorio: number;
// }

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

  // salas: Ramo[] = [
  //   { id: '#INF-201', nombre: 'Introducción a la Programación',nivel: 'II', cantidad_secciones: 2, cupos_por_seccion: 15, horas_catedra: 4, horas_laboratorio: 4 },
  //   { id: '#ECI-302', nombre: 'Matemáticas', nivel:'I', cantidad_secciones: 3, cupos_por_seccion: 20, horas_catedra: 4, horas_laboratorio: 4 },
  //   { id: '#ECI-102', nombre: 'Taller Software', nivel: 'III', cantidad_secciones: 2, cupos_por_seccion: 15, horas_catedra: 5, horas_laboratorio: 4 },
  //   { id: '#INE-202', nombre: 'Apps Móviles', nivel: 'II', cantidad_secciones: 1, cupos_por_seccion: 30, horas_catedra: 4, horas_laboratorio: 2 },
  //   { id: '#ECI-135', nombre: 'Cloud', nivel: 'I', cantidad_secciones: 1, cupos_por_seccion: 25, horas_catedra: 4, horas_laboratorio: 3 },

  // ];


  constructor(
    private dialog: MatDialog,  
    private ramosService: RamosService,
    private snackBar: MatSnackBar) 
    {}


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

  onFilter() { this.currentPage = 1; }

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