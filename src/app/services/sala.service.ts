import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Sala {
  id: string;
  nombre: string;
  tipo: 'Laboratorio' | 'Sala';
  capacidad: number;
}

@Injectable({ providedIn: 'root' })
export class SalasService {
  private url = '/datos-prueba/salas.json';
  private storageKey = 'info_salas'; 
  private salas$ = new BehaviorSubject<Sala[]>([]);

  constructor(private http: HttpClient) {
    this.inicializarDatos();
  }

  private inicializarDatos(): void {
    const datosLocales = localStorage.getItem(this.storageKey);

    if (datosLocales) {
      this.salas$.next(JSON.parse(datosLocales));
    } else {
      this.http.get<Sala[]>(this.url).subscribe({
        next: (data) => {
          this.salas$.next(data);
          this.guardarEnLocalStorage(data);
        },
        error: (err) => console.error('Error cargando salas desde JSON:', err)
      });
    }
  }

  private guardarEnLocalStorage(salas: Sala[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(salas));
  }

  getAll(): Observable<Sala[]> {
    return this.salas$.asObservable();
  }

  getSalasSync(): Sala[] {
    return this.salas$.getValue();
  }

  getById(id: string): Sala | undefined {
    return this.salas$.getValue().find(s => s.id === id);
  }

  agregar(sala: Omit<Sala, 'id'>): void {
    const id = `SALA-${Math.floor(Math.random() * 9000 + 1000)}`;
    const nueva: Sala = { id, ...sala };
    const actual = this.salas$.getValue();
    const nuevoListado = [nueva, ...actual];
    
    this.salas$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  eliminar(id: string): void {
    const actual = this.salas$.getValue();
    const nuevoListado = actual.filter(s => s.id !== id);

    this.salas$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  editar(id: string, datos: Partial<Omit<Sala, 'id'>>): void {
    const actual = this.salas$.getValue();
    const idx = actual.findIndex(s => s.id === id);
    if (idx === -1) return;

    const nuevaLista = [...actual];
    nuevaLista[idx] = { ...nuevaLista[idx], ...datos };
    
    this.salas$.next(nuevaLista);
    this.guardarEnLocalStorage(nuevaLista);
  }
}