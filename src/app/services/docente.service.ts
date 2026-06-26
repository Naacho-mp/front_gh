import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// interfaz para definir la forma de la disponibilidad
export interface DisponibilidadSlot {
  modulo: number;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;  
}

// interfaz de docente
export interface Docente {
  id: string;
  nombre: string;
  contrato: 'Full-time' | 'Part-time';
  disponibilidad?: DisponibilidadSlot[]; // opcional por si el docente es fulltime
}

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private url = '/datos-prueba/docentes.json';
  private storageKey = 'info_docentes'; // para identificar en localstorage
  private docentes$ = new BehaviorSubject<Docente[]>([]);

  constructor(private http: HttpClient) {
    this.inicializarDatos();
  }
  private inicializarDatos(): void {
    const datosLocales = localStorage.getItem(this.storageKey);

    if (datosLocales) {
      // Si ya existen registros modificados en el disco, los montamos directo a la RAM
      this.docentes$.next(JSON.parse(datosLocales));
    } else {
      // Si el navegador está vacío, consumimos los datos prueba del json
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

  getById(id: string): Docente | undefined {
    return this.docentes$.getValue().find(d => d.id === id);
  }

  //para agregar docente
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

  //eliminar docente
  eliminar(id: string): void {
    const actual = this.docentes$.getValue();
    const nuevoListado = actual.filter(d => d.id !== id);

    this.docentes$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  //actualizar docente
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
    return Array.from({ length: 8 }, (_, i) => ({
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