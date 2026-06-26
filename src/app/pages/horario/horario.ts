import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../services/horario.service';
import { Subscription } from 'rxjs';

interface Seccion {
  id: string;
  ramo: string;
  codigo: string;
  docente: string;
  sala: string;
  guardado: boolean;
  dia?: string;    
  modulo?: number; 
}

interface Ramo {
  nombre: string;      
  expandido: boolean;   
  secciones: Seccion[]; 
}

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.html',
  styleUrl: './horario.css'
})
export class Horario implements OnInit, OnDestroy {
  // Filtros superiores
  nivelSeleccionado: string = 'Nivel I';
  niveles: string[] = ['Nivel I', 'Nivel II', 'Nivel III', 'Nivel IV', 'Nivel V'];

  // Listados de los servicios docentes, ramos, salas, secciones
  docentesDisponibles: string[] = [];
  salasDisponibles: string[] = [];
  ramos: Ramo[] = [];
  secciones: Seccion[] = [];

  private subscriptions: Subscription = new Subscription();

  // Estructura fija de la grilla horaria
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

  // Paleta selectiva de colores para las secciones
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // listados de seleccion en base al filtrado
    this.subscriptions.add(
      this.horarioService.getDocentesNombres().subscribe(data => this.docentesDisponibles = data)
    );
    this.subscriptions.add(
      this.horarioService.getSalasNombres().subscribe(data => this.salasDisponibles = data)
    );

    //ramos por nivel
    this.cargarDatosPorNivel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Ejecuta la lógica de transformación del filtro a números romanos ('Nivel I' -> 'I')
  cargarDatosPorNivel(): void {
    const nivelRomano = this.nivelSeleccionado.replace('Nivel ', '').trim(); // Extrae 'I', 'II', 
    
    this.subscriptions.add(
      this.horarioService.getPanelIzquierdoPorNivel(nivelRomano).subscribe({
        next: (ramosConstruidos) => {
          this.ramos = ramosConstruidos;
          
          this.secciones = ramosConstruidos.reduce((acc, ramo) => [...acc, ...ramo.secciones], []);
          
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al poblar el panel de horarios:', err)
      })
    );
  }

  aplicarFiltro() {
    this.cargarDatosPorNivel();
  }

  getColorRamo(nombreRamo: string) {
    if (this.coloresAsignados[nombreRamo] === undefined) {
      this.coloresAsignados[nombreRamo] = this.contadorColor % this.colores.length;
      this.contadorColor++;
    }
    return this.colores[this.coloresAsignados[nombreRamo]];
  }

  guardarConfiguracionSeccion(seccion: Seccion) {
    if (seccion.sala ) {
      seccion.guardado = true;
    } else {
      alert('Por favor, asigne una sala antes de guardar.');
    }
  }

  editarConfiguracionSeccion(seccion: Seccion) {
    seccion.guardado = false;
    seccion.dia = undefined;
    seccion.modulo = undefined;
  }

  onDragStart(event: DragEvent, seccion: Seccion) {
    if (!seccion.guardado) {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData('text/plain', seccion.id);
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dia: string, moduloId: number) {
    event.preventDefault();
    const seccionId = event.dataTransfer?.getData('text/plain');
    
    if (seccionId) {
      let seccionConDatos: Seccion | undefined;
      for (const ramo of this.ramos) {
        seccionConDatos = ramo.secciones.find(s => s.id === seccionId);
        if (seccionConDatos) break;
      }
      
      if (seccionConDatos) {
        const seccionGrilla = this.secciones.find(s => s.id === seccionId);
        if (seccionGrilla) {
          seccionGrilla.docente = seccionConDatos.docente;
          seccionGrilla.sala = seccionConDatos.sala;
          seccionGrilla.dia = dia;
          seccionGrilla.modulo = moduloId;
        }
      }
    }
  }

  removerDeGrilla(seccion: Seccion) {
    seccion.dia = undefined;
    seccion.modulo = undefined;
  }
}