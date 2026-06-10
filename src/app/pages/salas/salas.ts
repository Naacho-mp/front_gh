import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SalaFormComponent } from '../../forms/forms-sala/forms-sala';

interface Sala {
  id: string;
  nombre: string;
  tipo: 'Laboratorio' | 'Sala';
  capacidad: number;
}

@Component({
  selector: 'app-salas',
  imports: [CommonModule, FormsModule],
  templateUrl: './salas.html',
  styleUrl: './salas.css',
})
export class Salas {
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;

  salas: Sala[] = [
    { id: '#SALA-1001', nombre: 'Laboratorio 3', tipo: 'Laboratorio', capacidad: 30 },
    { id: '#SALA-1002', nombre: 'Laboratorio 4', tipo: 'Laboratorio', capacidad: 40 },
    { id: '#SALA-1003', nombre: 'Laboratorio 19', tipo: 'Laboratorio',capacidad: 30, },
    { id: '#SALA-1004', nombre: 'Sala 401', tipo: 'Sala', capacidad: 30 },
    { id: '#SALA-1005', nombre: 'Sala 302', tipo: 'Sala', capacidad: 25 },

  ];

 constructor(private dialog: MatDialog) {}

  abrirRegistro(): void {
    const dialogRef = this.dialog.open(SalaFormComponent, {
      width: '560px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Sala guardada:', result);
        //this.salaService.crear(result).subscribe(...)
      }
    });
  }

  get totalSalas(): number { return this.salas.length; }
  get totalLaboratorio(): number { return this.salas.filter(d => d.tipo === 'Laboratorio').length; }
  get totalSala(): number { return this.salas.filter(d => d.tipo === 'Sala').length; }

  get filtrados(): Sala[] {
    return this.salas.filter(s =>
      s.nombre.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || s.tipo === this.filterType)
    );
  }

  get paginados(): Sala[] {
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

  disponibilidad(s: Sala) {
  console.log('Consultando disponibilidad de:', s.nombre);
}
  editar(d: Sala) { console.log('Editar', d); }
  eliminar(d: Sala) { console.log('Eliminar', d); }
}
