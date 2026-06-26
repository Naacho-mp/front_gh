import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private url = '/datos-prueba/ramos.json';
  private storageKey = 'info_ramos'; 
  private ramos$ = new BehaviorSubject<Ramo[]>([]);

  constructor(private http: HttpClient) {
    this.inicializarDatos();
  }
  private inicializarDatos(): void {
    const datosLocales = localStorage.getItem(this.storageKey);

    if (datosLocales) {
      
      this.ramos$.next(JSON.parse(datosLocales));
    } else {
      this.http.get<Ramo[]>(this.url).subscribe({
        next: (data) => {
          this.ramos$.next(data);
          this.guardarEnLocalStorage(data); 
        },
        error: (err) => console.error('Error cargando ramos desde JSON:', err)
      });
    }
  }

  private guardarEnLocalStorage(ramos: Ramo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ramos));
  }

  getAll(): Observable<Ramo[]> {
    return this.ramos$.asObservable();
  }

  getById(id: string): Ramo | undefined {
    return this.ramos$.getValue().find(r => r.id === id);
  }

  agregar(ramo: Omit<Ramo, 'id'>): void {
    const nivelNum = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5 }[ramo.nivel] ?? 0;
    
    const id = `ECI-${nivelNum}${Math.floor(Math.random() * 90 + 10)}`; 
    
    const nuevo: Ramo = { id, ...ramo };
    const actual = this.ramos$.getValue();
    const nuevoListado = [nuevo, ...actual];

    this.ramos$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  eliminar(id: string): void {
    const actual = this.ramos$.getValue();
    const nuevoListado = actual.filter(r => r.id !== id);

    this.ramos$.next(nuevoListado);
    this.guardarEnLocalStorage(nuevoListado);
  }

  editar(id: string, datos: Partial<Ramo>): void {
    const actual = this.ramos$.getValue();
    const idx = actual.findIndex(r => r.id === id);
    if (idx === -1) return;

    const nuevaLista = [...actual];
    nuevaLista[idx] = { ...nuevaLista[idx], ...datos };
    
    this.ramos$.next(nuevaLista);
    this.guardarEnLocalStorage(nuevaLista);
  }
}