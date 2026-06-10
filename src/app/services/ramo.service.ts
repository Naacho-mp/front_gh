import { Injectable } from '@angular/core';

export interface Ramo {
  id: string;
  nombre: string;
  nivel: string;
  cantidad_secciones: number;
  cupos_por_seccion: number;
  horas_catedra: number;
  horas_laboratorio: number;
} 

@Injectable({ providedIn: 'root' })
export class RamosService {
  private ramos: Ramo[] = [
    { id: '#INF-201', nombre: 'Introducción a la Programación', nivel: 'II', cantidad_secciones: 2, cupos_por_seccion: 15, horas_catedra: 4, horas_laboratorio: 4 },
    { id: '#ECI-302', nombre: 'Matemáticas', nivel: 'I', cantidad_secciones: 3, cupos_por_seccion: 20, horas_catedra: 4, horas_laboratorio: 4 },
  ];

  getAll(): Ramo[] {
    return this.ramos;
  }

  agregar(ramo: Omit<Ramo, 'id'>): void {
    const nivelNum = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5 }[ramo.nivel] ?? 0;
    const id = `#ECI-${nivelNum}00`;
    this.ramos.push({ id, ...ramo });
  }

  eliminar(id: string): void {
    this.ramos = this.ramos.filter(r => r.id !== id);
  }

  editar(id: string, datos: Partial<Ramo>): void {
    const idx = this.ramos.findIndex(r => r.id === id);
    if (idx !== -1) this.ramos[idx] = { ...this.ramos[idx], ...datos };
  }
}