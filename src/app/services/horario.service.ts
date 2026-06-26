import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RamosService } from './ramo.service';
import { DocenteService } from './docente.service';
import { SalasService } from './sala.service';
import { SeccionesService } from './seccion.service';

@Injectable({ providedIn: 'root' })
export class HorarioService {

  constructor(
    private ramosService: RamosService,
    private docenteService: DocenteService,
    private salasService: SalasService,
    private seccionesService: SeccionesService
  ) {}

  // para nombres de los docentes
  getDocentesNombres(): Observable<string[]> {
    return this.docenteService.getAll().pipe(
      map(docentes => docentes.map(d => d.nombre))
    );
  }

  // para los nombres de las salas
  getSalasNombres(): Observable<string[]> {
    return this.salasService.getAll().pipe(
      map(salas => salas.map(s => s.nombre))
    );
  }

  // Combina Ramos y Secciones en tiempo real filtrados por el nivel académico
  getPanelIzquierdoPorNivel(nivelRomano: string): Observable<any[]> {
    return combineLatest([
      this.ramosService.getAll(),
      this.seccionesService.getAll()
    ]).pipe(
      map(([allRamos, allSecciones]) => {
        // filtrar los ramos que pertenecen al nivel seleccionado
        const ramosDelNivel = allRamos.filter(r => r.nivel === nivelRomano);

        // filtrar por cada ramo del nivel,  y se adjunta sus secciones reales
        return ramosDelNivel.map(ramo => {
          
          const seccionesDelRamo = allSecciones
            .filter(s => s.codigo_ramo === ramo.id)
            .map(s => ({
              id: s.id,
              ramo: ramo.nombre,
              codigo: `${ramo.id}-S${s.numero_seccion}`, 
              docente: '', // vacio para completar en el panel antes del drag and drop
              sala: '',    // vacio para completar en el panel
              guardado: false
            }));

          return {
            nombre: ramo.nombre,
            expandido: false,
            secciones: seccionesDelRamo
          };
        });
      })
    );
  }
}