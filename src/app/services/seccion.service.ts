import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Seccion {
  id: string;
  codigo_ramo: string;
  numero_seccion: string; 
  estudiantes_inscritos: number;
}

@Injectable({ providedIn: 'root' })
export class SeccionesService {
  private url = '/datos-prueba/secciones.json';
  private storageKey = 'info_secciones';
  private secciones$ = new BehaviorSubject<Seccion[]>([]);

  constructor(private http: HttpClient) {
    this.inicializarDatos();
  }

  private inicializarDatos(): void {
    const datosLocales = localStorage.getItem(this.storageKey);

    if (datosLocales) {
      this.secciones$.next(JSON.parse(datosLocales));
    } else {
      this.http.get<Seccion[]>(this.url).subscribe({
        next: (data) => {
          this.secciones$.next(data);
          this.guardarEnLocalStorage(data); 
        },
        error: (err) => console.error('Error cargando secciones desde JSON:', err)
      });
    }
  }

  private guardarEnLocalStorage(secciones: Seccion[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(secciones));
  }

  getAll(): Observable<Seccion[]> {
    return this.secciones$.asObservable();
  }

  getSeccionesSync(): Seccion[] {
    return this.secciones$.getValue();
  }

  getById(id: string): Seccion | undefined {
    return this.secciones$.getValue().find(s => s.id === id);
  }

  agregar(seccion: Omit<Seccion, 'id'>): boolean {
  
    const id = `${seccion.codigo_ramo}-S${seccion.numero_seccion}`;
    const actual = this.secciones$.getValue();

    const yaExiste = actual.some(s => s.id === id);
    if (yaExiste) {
      return false; 
    }

    const nueva: Seccion = { id, ...seccion };
    const nuevoListado = [nueva, ...actual];

    this.secciones$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
    return true;
  }

  eliminar(id: string): void {
    const actual = this.secciones$.getValue();
    const nuevoListado = actual.filter(s => s.id !== id);

    this.secciones$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  // Elimina todas las secciones asociadas a un ramo (usado en cascada desde RamosService
  // cuando se elimina un ramo completo).
  eliminarPorRamo(codigoRamo: string): void {
    const actual = this.secciones$.getValue();
    const nuevoListado = actual.filter(s => s.codigo_ramo !== codigoRamo);

    this.secciones$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  editar(id: string, datos: Partial<Omit<Seccion, 'id'>>): boolean {
    const actual = this.secciones$.getValue();
    const idx = actual.findIndex(s => s.id === id);
    if (idx === -1) return false;

    const nuevaLista = [...actual];
    const seccionActualizada = { ...nuevaLista[idx], ...datos };

    // Si cambia el número de sección o el ramo, se regenera el id con el mismo
    // esquema único (codigo_ramo + numero_seccion) usado en agregar().
    if (datos.numero_seccion !== undefined || datos.codigo_ramo !== undefined) {
      const nuevoId = `${seccionActualizada.codigo_ramo}-S${seccionActualizada.numero_seccion}`;

      const colisionaConOtra = actual.some((s, i) => i !== idx && s.id === nuevoId);
      if (colisionaConOtra) {
        return false;
      }

      seccionActualizada.id = nuevoId;
    }

    nuevaLista[idx] = seccionActualizada;

    this.secciones$.next(nuevaLista);
    this.guardarEnLocalStorage(nuevaLista);
    return true;
  }
}