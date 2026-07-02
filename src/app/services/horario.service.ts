import { Injectable } from '@angular/core';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RamosService } from './ramo.service';
import { DocenteService } from './docente.service';
import { SalasService } from './sala.service';
import { SeccionesService } from './seccion.service';
import * as XLSX from 'xlsx';

export interface BloqueHorarioAsignado {
  id: string;
  seccionId: string;
  ramoId: string;
  ramoNombre: string;
  codigoCompleto: string;
  nivel: string;
  docente: string;
  sala: string;
  dia: string;
  modulo: number;
  tipo: 'C' | 'L'; 
  enConflicto?: boolean;
  conflictos?: string[];
}

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private storageKey = 'info_bloques_asignados';
  private bloquesAsignados$ = new BehaviorSubject<BloqueHorarioAsignado[]>([]);

  constructor(
    private ramosService: RamosService,
    private docenteService: DocenteService,
    private salasService: SalasService,
    private seccionesService: SeccionesService
  ) {
    this.cargarBloquesDesdeStorage();
  }

  private cargarBloquesDesdeStorage(): void {
    const locales = localStorage.getItem(this.storageKey);
    if (locales) {
      this.bloquesAsignados$.next(JSON.parse(locales));
    }
  }

  private guardarBloquesEnStorage(bloques: BloqueHorarioAsignado[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(bloques));
    this.bloquesAsignados$.next(bloques);
  }

  getDocentesNombres(): Observable<string[]> {
    return this.docenteService.getAll().pipe(
      map(docentes => docentes.map(d => d.nombre))
    );
  }

  getSalasNombres(): Observable<string[]> {
    return this.salasService.getAll().pipe(
      map(salas => salas.map(s => s.nombre))
    );
  }

  getBloquesGlobales(): Observable<BloqueHorarioAsignado[]> {
    return this.bloquesAsignados$.asObservable();
  }

  // Genera el listado dinámico con la validación de conflictos en tiempo real
  getGrillaHorariaConConflictos(): Observable<any[]> {
    return combineLatest([
      this.bloquesAsignados$.asObservable(),
      this.ramosService.getAll(),
      this.seccionesService.getAll(),
      this.docenteService.getAll(),
      this.salasService.getAll()
    ]).pipe(
      map(([bloques, ramos, secciones, docentes, salas]) => {
        return bloques.map(b => {
          const conflictos = this.calcularConflictos(b, bloques, ramos, secciones, docentes, salas);
          return {
            ...b,
            conflictos,
            enConflicto: conflictos.length > 0
          };
        });
      })
    );
  }

  // Reconstruye el panel izquierdo descontando bloques asignados paso a paso
  getPanelIzquierdoPorNivel(nivelRomano: string): Observable<any[]> {
    return combineLatest([
      this.ramosService.getAll(),
      this.seccionesService.getAll(),
      this.bloquesAsignados$.asObservable()
    ]).pipe(
      map(([allRamos, allSecciones, allBloques]) => {
        const ramosDelNivel = allRamos.filter(r => r.nivel === nivelRomano);

        return ramosDelNivel.map(ramo => {
          const seccionesDelRamo = allSecciones
            .filter(s => s.codigo_ramo === ramo.id)
            .map(s => {
              const bloquesDeEstaSeccion = allBloques.filter(b => b.seccionId === s.id);
              const catedraAsignada = bloquesDeEstaSeccion.filter(b => b.tipo === 'C').length;
              const labAsignado = bloquesDeEstaSeccion.filter(b => b.tipo === 'L').length;

              return {
                id: s.id,
                ramo: ramo.nombre,
                ramoId: ramo.id,
                nivel: ramo.nivel,
                codigo: `${ramo.id}-S${s.numero_seccion}`, 
                docente: '', 
                sala: '',    
                guardado: false,
                estudiantes_inscritos: s.estudiantes_inscritos,
                horas_catedra_req: ramo.horas_catedra,
                horas_laboratorio_req: ramo.horas_laboratorio,
                horas_catedra_asig: catedraAsignada,
                horas_laboratorio_asig: labAsignado
              };
            });

          return {
            nombre: ramo.nombre,
            expandido: false,
            secciones: seccionesDelRamo
          };
        });
      })
    );
  }

  asignarBloque(nuevoBloque: Omit<BloqueHorarioAsignado, 'id'>): void {
    const actual = this.bloquesAsignados$.getValue();
    const bloqueConId: BloqueHorarioAsignado = {
      ...nuevoBloque,
      id: `BLK-${Math.floor(Math.random() * 90000 + 10000)}`
    };
    this.guardarBloquesEnStorage([...actual, bloqueConId]);
  }

  removerBloque(bloqueId: string): void {
    const actual = this.bloquesAsignados$.getValue();
    const filtrados = actual.filter(b => b.id !== bloqueId);
    this.guardarBloquesEnStorage(filtrados);
  }

  // Motor de Validaciones
  calcularConflictos(
    bloque: BloqueHorarioAsignado,
    todosBloques: BloqueHorarioAsignado[],
    ramos: any[],
    secciones: any[],
    docentes: any[],
    salas: any[]
  ): string[] {
    const conflictos: string[] = [];

    // Validación de Docente en paralelo
    if (bloque.docente) {
      const docenteOcupado = todosBloques.some(b => 
        b.id !== bloque.id && 
        b.dia === bloque.dia && 
        b.modulo === bloque.modulo && 
        b.docente === bloque.docente
      );
      if (docenteOcupado) {
        conflictos.push(`El docente ${bloque.docente} ya se encuentra dictando clase en otra sección en este bloque.`);
      }
    }

    // Validación de Sala/Recurso en paralelo
    if (bloque.sala) {
      const salaOcupada = todosBloques.some(b => 
        b.id !== bloque.id && 
        b.dia === bloque.dia && 
        b.modulo === bloque.modulo && 
        b.sala === bloque.sala
      );
      if (salaOcupada) {
        conflictos.push(`La sala/laboratorio ${bloque.sala} ya está asignada a otra sección en este bloque.`);
      }
    }

    // Validación de disponibilidad para docentes de tipo Part-Time
    if (bloque.docente) {
      const perfilDocente = docentes.find(d => d.nombre === bloque.docente);
      if (perfilDocente && perfilDocente.contrato === 'Part-time' && perfilDocente.disponibilidad) {
        const slotModulo = perfilDocente.disponibilidad.find((s: any) => s.modulo === bloque.modulo);
        const diaClave = bloque.dia.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") as 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

        if (!slotModulo || !slotModulo[diaClave]) {
          conflictos.push(`El docente Part-Time ${bloque.docente} no tiene declarada disponibilidad en este bloque.`);
        }
      }
    }

    // Validación de capacidad de aforo físico vs alumnos matriculados
    const seccionData = secciones.find(s => s.id === bloque.seccionId);
    const salaData = salas.find(s => s.nombre === bloque.sala);

    if (seccionData && salaData) {
      if (seccionData.estudiantes_inscritos > salaData.capacidad) {
        conflictos.push(`Sobrecarga de aforo: La sala posee capacidad para ${salaData.capacidad} estudiantes, pero la sección tiene ${seccionData.estudiantes_inscritos} inscritos.`);
      }
    }

    // Validación de colisión de nivel académico (Estudiantes del mismo nivel)
    const conflictoNivel = todosBloques.some(b => 
      b.id !== bloque.id && 
      b.dia === bloque.dia && 
      b.modulo === bloque.modulo && 
      b.nivel === bloque.nivel && 
      b.seccionId !== bloque.seccionId
    );
    if (conflictoNivel) {
      conflictos.push(`Conflicto de Nivel: Los alumnos de ${bloque.nivel} ya presentan otra actividad curricular concurrente en este mismo bloque.`);
    }

    //Validacion de superar horas catedra / laboratorio
    const ramoData = ramos.find(r=> r.id === bloque.ramoId);
    
    if (ramoData) {
      const bloquesDeEsteTipoEnLaSeccion = todosBloques.filter(b =>
        b.seccionId === bloque.seccionId && b.tipo === bloque.tipo
      ).length;

        if (bloque.tipo === 'C' && bloquesDeEsteTipoEnLaSeccion > ramoData.horas_catedra) {
    conflictos.push(`Exceso de horas de cátedra: la sección ya tiene ${bloquesDeEsteTipoEnLaSeccion} bloques de cátedra asignados, pero el ramo solo requiere ${ramoData.horas_catedra}.`);
  }

        if (bloque.tipo === 'L' && bloquesDeEsteTipoEnLaSeccion > ramoData.horas_laboratorio) {
          conflictos.push(`Exceso de horas de laboratorio: la sección ya tiene ${bloquesDeEsteTipoEnLaSeccion} bloques de laboratorio asignados, pero el ramo solo requiere ${ramoData.horas_laboratorio}.`);
        }
      }


    return conflictos;
  }


  // Exportador de bloques a formato Excel (.xlsx) mediante XLSX
  exportarBloquesAExcel(): void {
    const bloquesActuales = this.bloquesAsignados$.getValue();
    
    const filasReporte = bloquesActuales.map(b => ({
      'Día Académico': b.dia,
      'Módulo Horario': b.modulo,
      'Nivel de la Carrera': b.nivel,
      'Asignatura / Ramo': b.ramoNombre,
      'Código Sección': b.codigoCompleto,
      'Tipo de Bloque': b.tipo === 'C' ? 'Cátedra' : 'Laboratorio',
      'Docente Asignado': b.docente || 'Sin docente asignado',
      'Sala / Laboratorio': b.sala || 'Sin ubicación asignada'
    }));

    const hojaDeTrabajo = XLSX.utils.json_to_sheet(filasReporte);
    const libroDeTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'Planificación Horaria');

    // Ajustar anchos automáticos de columnas
    const anchosColumnas = [
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 30 },
      { wch: 18 }, { wch: 15 }, { wch: 25 }, { wch: 20 }
    ];
    hojaDeTrabajo['!cols'] = anchosColumnas;

    XLSX.writeFile(libroDeTrabajo, 'Planificacion_Horaria_UCM.xlsx');
  }
}