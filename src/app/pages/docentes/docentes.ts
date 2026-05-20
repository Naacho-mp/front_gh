import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DocenteFormComponent } from '../../forms/forms-docente/forms-docente';
import  { DocenteService } from '../../services/docente.service';

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


  constructor(private dialog: MatDialog) {}

  abrirRegistro(): void {
    const dialogRef = this.dialog.open(DocenteFormComponent, {
      width: '560px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Docente guardado:', result);
        //this.docenteService.crear(result).subscribe(...)
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

  disponibilidad(s: Docente) {
  console.log('Consultando disponibilidad de:', s.nombre);
}


  editar(d: Docente) { console.log('Editar', d); }
  
  eliminar(d: Docente) { console.log('Eliminar', d); }

// Funciones para modal de subir archivo

mostrarModalImportar = false;
archivoSeleccionado: File | null = null;

onArchivoSeleccionado(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) this.archivoSeleccionado = input.files[0];
}

subir(): void {
  if (!this.archivoSeleccionado) return;
  console.log('Subiendo:', this.archivoSeleccionado.name);
  this.mostrarModalImportar = false;
  this.archivoSeleccionado = null;
}




}