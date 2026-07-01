import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService, BloqueHorarioAsignado } from '../../services/horario.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface SeccionPanel {
  id: string;
  ramo: string;
  ramoId: string;
  nivel: string;
  codigo: string;
  docente: string;
  sala: string;
  guardado: boolean;
  estudiantes_inscritos: number;
  horas_catedra_req: number;
  horas_laboratorio_req: number;
  horas_catedra_asig: number;
  horas_laboratorio_asig: number;
}

interface RamoPanel {
  nombre: string;      
  expandido: boolean;   
  secciones: SeccionPanel[]; 
}

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule,MatSnackBarModule],
  templateUrl: './horario.html',
  styleUrl: './horario.css'
})
export class Horario implements OnInit, OnDestroy {
  // Filtros de nivel académico de la carrera
  nivelSeleccionado: string = 'Nivel I';
  niveles: string[] = ['Nivel I', 'Nivel II', 'Nivel III', 'Nivel IV', 'Nivel V'];

  // Estados locales reactivos
  docentesDisponibles: string[] = [];
  salasDisponibles: string[] = [];
  ramos: RamoPanel[] = [];
  secciones: SeccionPanel[] = [];
  bloquesGlobales: any[] = [];

  private subscriptions: Subscription = new Subscription();
  private panelSubscription: Subscription | null = null;

  // Estructura de la grilla de Ingeniería Civil en Informática UCM
  dias: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  modulos = [
    { id: 1, horas: '08:30 - 09:30' },
    { id: 2, horas: '09:35 - 10:35' },
    { id: 3, horas: '10:50 - 11:50' },
    { id: 4, horas: '11:55 - 12:55' },
    { id: 5, horas: '13:10 - 14:10' },
    { id: 6, horas: '14:30 - 15:30' },
    { id: 7, horas: '15:35 - 16:35' },
    { id: 8, horas: '16:50 - 17:50' },
    { id: 9, horas: '17:55 - 18:55' }
  ];

  // Configuración estética de paletas cromáticas por Asignatura
  readonly colores = [
    { bg: '#eff6ff', borde: '#2563eb', titulo: '#1e3a8a', meta: '#2563eb' }, 
    { bg: '#f0fdf4', borde: '#16a34a', titulo: '#14532d', meta: '#16a34a' }, 
    { bg: '#fdf4ff', borde: '#9333ea', titulo: '#581c87', meta: '#9333ea' }, 
    { bg: '#fef2f2', borde: '#dc2626', titulo: '#7f1d1d', meta: '#dc2626' },  
    { bg: '#fefce8', borde: '#ca8a04', titulo: '#713f12', meta: '#ca8a04' },  
    { bg: '#ecfeff', borde: '#0891b2', titulo: '#164e63', meta: '#08c6f5' }, 
  ];
  private coloresAsignados: { [nombreRamo: string]: number } = {};
  private contadorColor: number = 0;

  constructor(
    private horarioService: HorarioService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Escucha de listas maestras filtradas
    this.subscriptions.add(
      this.horarioService.getDocentesNombres().subscribe(data => this.docentesDisponibles = data)
    );
    this.subscriptions.add(
      this.horarioService.getSalasNombres().subscribe(data => this.salasDisponibles = data)
    );

    // Conexión en tiempo real con asignaciones globales y cálculo de conflictos
    this.subscriptions.add(
      this.horarioService.getGrillaHorariaConConflictos().subscribe({
        next: (bloquesValidados) => {
          this.bloquesGlobales = bloquesValidados;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando grilla con conflictos:', err)
      })
    );

    this.cargarDatosPorNivel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.panelSubscription) {
      this.panelSubscription.unsubscribe();
    }
  }

  // Carga estructural reactiva del panel lateral izquierdo
  cargarDatosPorNivel(): void {
  if (this.panelSubscription) {
    this.panelSubscription.unsubscribe();
  }

  const nivelRomano = this.nivelSeleccionado.replace('Nivel ', '').trim();
  
  this.panelSubscription = this.horarioService.getPanelIzquierdoPorNivel(nivelRomano).subscribe({
    next: (ramosConstruidos) => {
     
      this.ramos = ramosConstruidos.map(nuevoRamo => {
        const ramoExistente = this.ramos.find(r => r.nombre === nuevoRamo.nombre);

        const seccionesFusionadas = nuevoRamo.secciones.map((nuevaSeccion: SeccionPanel) => {
          const seccionExistente = this.secciones.find(s => s.id === nuevaSeccion.id);

          if (seccionExistente && seccionExistente.guardado) {
            return {
              ...nuevaSeccion, // trae los contadores actualizados
              guardado: true,
              docente: seccionExistente.docente,
              sala: seccionExistente.sala
            };
          }

          return nuevaSeccion;
        });

        return {
          ...nuevoRamo,
          expandido: ramoExistente ? ramoExistente.expandido : false,
          secciones: seccionesFusionadas
        };
      });

      this.secciones = this.ramos.reduce<SeccionPanel[]>((acc, ramo) => [...acc, ...ramo.secciones], []);
      
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error al poblar el panel de horarios:', err)
  });
}

  aplicarFiltro(): void {
    this.cargarDatosPorNivel();
  }

  getColorRamo(nombreRamo: string) {
    if (this.coloresAsignados[nombreRamo] === undefined) {
      this.coloresAsignados[nombreRamo] = this.contadorColor % this.colores.length;
      this.contadorColor++;
    }
    return this.colores[this.coloresAsignados[nombreRamo]];
  }

  guardarConfiguracionSeccion(seccion: SeccionPanel): void {
    if (seccion.sala) {
      seccion.guardado = true;
    } else {
      this.snackBar.open('Por favor, asigne una sala/laboratorio antes de guardar la sección.', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar']
      });
    }
  }

  editarConfiguracionSeccion(seccion: SeccionPanel): void {
    seccion.guardado = false;
  }

  // Lógica Drag and Drop orientada a Bloques específicos
  onDragStart(event: DragEvent, seccion: SeccionPanel, tipoBloque: 'C' | 'L'): void {
    if (!seccion.guardado) {
      event.preventDefault();
      return;
    }

    const payload = {
      seccionId: seccion.id,
      tipo: tipoBloque
    };

    event.dataTransfer?.setData('application/json', JSON.stringify(payload));
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dia: string, moduloId: number): void {
    event.preventDefault();
    const rawData = event.dataTransfer?.getData('application/json');
    
    if (rawData) {
      try {
        const payload = JSON.parse(rawData);
        const seccionContexto = this.secciones.find(s => s.id === payload.seccionId);

        if (seccionContexto) {
          
          this.horarioService.asignarBloque({
            seccionId: seccionContexto.id,
            ramoId: seccionContexto.ramoId,
            ramoNombre: seccionContexto.ramo,
            codigoCompleto: seccionContexto.codigo,
            nivel: seccionContexto.nivel,
            docente: seccionContexto.docente,
            sala: seccionContexto.sala,
            dia: dia,
            modulo: moduloId,
            tipo: payload.tipo
          });
        }
      } catch (err) {
        console.error('Error procesando el bloque en el drop:', err);
      }
    }
  }

  removerBloqueDeGrilla(bloqueId: string): void {
    this.horarioService.removerBloque(bloqueId);
  }

  getBloquesCelda(dia: string, moduloId: number): BloqueHorarioAsignado[] {
    return this.bloquesGlobales.filter(b => b.dia === dia && b.modulo === moduloId);
  }

  // avisos visuales para cálculo de estados por color por sección
  esAsignacionIncompleta(sec: SeccionPanel): boolean {
    return sec.horas_catedra_asig < sec.horas_catedra_req || sec.horas_laboratorio_asig < sec.horas_laboratorio_req;
  }

  esAsignacionExcedida(sec: SeccionPanel): boolean {
    return sec.horas_catedra_asig > sec.horas_catedra_req || sec.horas_laboratorio_asig > sec.horas_laboratorio_req;
  }

  esAsignacionPerfecta(sec: SeccionPanel): boolean {
    return sec.horas_catedra_asig === sec.horas_catedra_req && sec.horas_laboratorio_asig === sec.horas_laboratorio_req;
  }

  getBordeEstadoSeccion(sec: SeccionPanel): string {
    if (!sec.guardado) return '#d7d407'; // editado
    if (this.esAsignacionPerfecta(sec)) return '#189d5f'; // completo
    if (this.esAsignacionExcedida(sec)) return '#dc3545'; // exceso
    return '#d7d407'; // pendiente
  }

  exportarAExcel(): void {
    if (!this.bloquesGlobales || this.bloquesGlobales.length === 0) {
      this.snackBar.open('Aún no has asignado ningún bloque en la grilla horaria. Arrastra al menos un bloque antes de exportar.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar']
      });
      return;
    }
 
    this.horarioService.exportarBloquesAExcel();
  }
}