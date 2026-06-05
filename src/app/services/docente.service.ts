import { Injectable } from '@angular/core';

interface Docente {
  id: string;
  nombre: string;
  contrato: 'Full-time' | 'Part-time';
}

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private docentes: Docente[] = [
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

  private nextId = 1013;

  getAll(): Docente[] {
    return this.docentes
  }

 agregar(docente: Omit<Docente, 'id'>): void {
  const nuevo: Docente = {
    id: `#DOC-${Math.floor(Math.random() * 9000 + 1000)}`,          
    ...docente,
  };
  this.docentes.push(nuevo);                
}

  eliminar(id: string): void {
    this.docentes = this.docentes.filter(d => d.id !== id);
  }

  editar(id: string, datos: Partial<Omit<Docente, 'id'>>): void {
    const idx = this.docentes.findIndex(d => d.id === id);
    if (idx !== -1) this.docentes[idx] = { ...this.docentes[idx], ...datos };
  }

}