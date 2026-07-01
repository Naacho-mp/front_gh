import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DisponibilidadSlot {
  modulo: number;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;  
}

export interface Docente {
  id: string;
  nombre: string;
  contrato: 'Full-time' | 'Part-time';
  disponibilidad?: DisponibilidadSlot[];
}

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private url = '/datos-prueba/docentes.json';
  private storageKey = 'info_docentes';
  private docentes$ = new BehaviorSubject<Docente[]>([]);

  constructor(private http: HttpClient) {
    this.inicializarDatos();
  }

  private inicializarDatos(): void {
    const datosLocales = localStorage.getItem(this.storageKey);

    if (datosLocales) {
      this.docentes$.next(JSON.parse(datosLocales));
    } else {
      this.http.get<Docente[]>(this.url).subscribe({
        next: (data) => {
          this.docentes$.next(data);
          this.guardarEnLocalStorage(data);
        },
        error: (err) => console.error('Error cargando docentes desde JSON:', err)
      });
    }
  }

  private guardarEnLocalStorage(docentes: Docente[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(docentes));
  }

  getAll(): Observable<Docente[]> {
    return this.docentes$.asObservable();
  }

  getDocentesSync(): Docente[] {
    return this.docentes$.getValue();
  }

  getById(id: string): Docente | undefined {
    return this.docentes$.getValue().find(d => d.id === id);
  }

  agregar(docente: Omit<Docente, 'id'>): void {
    const nuevo: Docente = {
      id: `DOC-${Math.floor(Math.random() * 9000 + 1000)}`,          
      ...docente,
      disponibilidad: docente.contrato === 'Part-time'
        ? (docente.disponibilidad ?? this.disponibilidadVacia())
        : undefined
    };
    
    const actual = this.docentes$.getValue();
    const nuevoListado = [nuevo, ...actual];

    this.docentes$.next(nuevoListado); 
    this.guardarEnLocalStorage(nuevoListado);        
  }

  agregarDesdeExcel(docente: Omit<Docente, 'id'>): boolean {
    const actual = this.docentes$.getValue();

    if (actual.some(d => d.nombre.toLowerCase() === docente.nombre.toLowerCase())) return false;

    try {
      const nuevo: Docente = {
        id: `DOC-${Math.floor(Math.random() * 9000 + 1000)}`,
        ...docente,
        disponibilidad: docente.contrato === 'Part-time'
          ? (docente.disponibilidad ?? this.disponibilidadVacia())
          : undefined
      };

      const nuevoListado = [nuevo, ...actual];
      this.docentes$.next(nuevoListado);
      this.guardarEnLocalStorage(nuevoListado);
      return true;
    } catch {
      return false;
    }
  }

  eliminar(id: string): void {
    const actual = this.docentes$.getValue();
    const nuevoListado = actual.filter(d => d.id !== id);

    this.docentes$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  actualizar(id: string, datos: Partial<Omit<Docente, 'id'>>): void {
    const actual = this.docentes$.getValue();
    const idx = actual.findIndex(d => d.id === id);
    if (idx === -1) return;

    const docenteActual = actual[idx];
    const actualizado: Docente = {
      ...docenteActual,
      ...datos,
      disponibilidad: datos.contrato === 'Full-time'
        ? undefined
        : datos.disponibilidad ?? docenteActual.disponibilidad ?? this.disponibilidadVacia()
    };

    const nuevaLista = [...actual];
    nuevaLista[idx] = actualizado;

    this.docentes$.next(nuevaLista);
    this.guardarEnLocalStorage(nuevaLista);
  }

  actualizarDisponibilidad(id: string, disponibilidad: DisponibilidadSlot[]): void {
    const actual = this.docentes$.getValue();
    const idx = actual.findIndex(d => d.id === id);
    if (idx === -1) return;

    const nuevaLista = [...actual];
    nuevaLista[idx] = { ...nuevaLista[idx], disponibilidad };

    this.docentes$.next(nuevaLista);
    this.guardarEnLocalStorage(nuevaLista);
  }

  private disponibilidadVacia(): DisponibilidadSlot[] {
    return Array.from({ length: 9 }, (_, i) => ({
      modulo: i + 1,
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false
    }));
  }
}