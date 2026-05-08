import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Seccion {
  id:String;
  codigo_ramo: String;
  numero_seccion: String;
  estudiantes_inscritos: number;
}

@Component({
  selector: 'app-secciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './secciones.html',
  styleUrl: './secciones.css',
})
export class Secciones {
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;

   salas: Seccion[] = [
    { id: '#S-01', codigo_ramo: '#INF-201', numero_seccion: '01', estudiantes_inscritos: 15 },
    { id: '#S-02', codigo_ramo: '#ECI-302', numero_seccion: '02', estudiantes_inscritos: 20 },
    { id: '#S-03', codigo_ramo: '#ECI-102', numero_seccion: '03', estudiantes_inscritos: 15 },
    { id: '#S-04', codigo_ramo: '#INE-202', numero_seccion: '04', estudiantes_inscritos: 30 },
    { id: '#S-05', codigo_ramo: '#ECI-135', numero_seccion: '05', estudiantes_inscritos: 25 },
    { id: '#S-06', codigo_ramo: '#ECI-136', numero_seccion: '06', estudiantes_inscritos: 40 },

  ];

    get filtrados(): Seccion[] {
    return this.salas.filter(s =>
      s.codigo_ramo.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || s.numero_seccion === this.filterType)
    );
  }

   get paginados(): Seccion[] {
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

  editar(d: Seccion) { console.log('Editar', d); }
  eliminar(d: Seccion) { console.log('Eliminar', d); }
}
