import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Seccion {
  id: number;
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
export class Horario {
  // Filtros superiores
  nivelSeleccionado: string = 'Nivel I';
  niveles: string[] = ['Nivel I', 'Nivel II', 'Nivel III', 'Nivel IV', 'Nivel V'];

  // Datos hardcodeados para los selectores internos de las tarjetas
  docentesDisponibles: string[] = ['Marco Toranzo', 'Felipe Tirado', 'Raúl Durán', 'Carlos Castro'];
  salasDisponibles: string[] = ['Sala 411', 'Lab 3', 'Lab 4', 'Sala 19'];

  // Definición de la estructura de la grilla horaria
  dias: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  
  //modulos solo hasta el modulo 9 dado que es civil informatica
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

  // Listado inicial de secciones del nivel cargado (hardcodeados)
  secciones: Seccion[] = [
    { id: 1, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S1', docente: '', sala: '', guardado: false },
    { id: 2, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S2', docente: '', sala: '', guardado: false },
    { id: 3, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S3', docente: '', sala: '', guardado: false },

    { id: 4, ramo: 'Álgebra Lineal', codigo: 'INF-103-S1', docente: '', sala: '', guardado: false },
    { id: 5, ramo: 'Física Mecánica', codigo: 'INF-104-S1', docente: '', sala: '', guardado: false },

    { id: 6, ramo: 'Módulo I', codigo: 'INL-101-S1', docente: '', sala: '', guardado: false },

    { id: 7, ramo: 'Apps Móviles', codigo: 'ANF-119-S1', docente: '', sala: '', guardado: false },

    { id: 8, ramo: 'Matemáticas I', codigo: 'MAT-129-S1', docente: '', sala: '', guardado: false },
    
  ];

  ramos: Ramo[] = [
    {
      nombre: 'Cálculo Diferencial',
      expandido: false, 
      secciones: [
        { id: 1, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S1', docente: '', sala: '', guardado: false },
        { id: 2, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S2', docente: '', sala: '', guardado: false },
        { id: 3, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S3', docente: '', sala: '', guardado: false },
  
      ]
    },
    {
      nombre: 'Álgebra Lineal',
      expandido: false, 
      secciones: [
        { id: 4, ramo: 'Álgebra Lineal', codigo: 'INF-103-S1', docente: '', sala: '', guardado: false },
      ]
    },
    {
      nombre: 'Física Mecánica',
      expandido: false,
      secciones: [
        { id: 5, ramo: 'Física Mecánica', codigo: 'INF-104-S1', docente: '', sala: '', guardado: false },
      ]
    }
    ,
    {
      nombre: 'Módulo I',
      expandido: false,
      secciones: [
        { id: 6, ramo: 'Módulo I', codigo: 'INL-101-S1', docente: '', sala: '', guardado: false },
      ]
    }
    ,
    {
      nombre: 'Apps Móviles',
      expandido: false,
      secciones: [
        { id: 7, ramo: 'Apps Móviles', codigo: 'ANF-119-S1', docente: '', sala: '', guardado: false },
      ]
    }
    ,
    {
      nombre: 'Matemáticas I',
      expandido: false,
      secciones: [
        { id: 8, ramo: 'Matemáticas I', codigo: 'MAT-129-S1', docente: '', sala: '', guardado: false },
      ]
    }
  ];

  //Para colores de los ramos de forma selectiva (6 colores, xq es el maximo de ramos que hay en un semestre en ici)
  readonly colores = [
  { bg: '#eff6ff', borde: '#2563eb', titulo: '#1e3a8a', meta: '#2563eb' }, 
  { bg: '#f0fdf4', borde: '#16a34a', titulo: '#14532d', meta: '#16a34a' }, 
  { bg: '#fdf4ff', borde: '#9333ea', titulo: '#581c87', meta: '#9333ea' }, 
  { bg: '#fef2f2', borde: '#dc2626', titulo: '#7f1d1d', meta: '#dc2626' },  
  { bg: '#fefce8', borde: '#ca8a04', titulo: '#713f12', meta: '#ca8a04' },  
  { bg: '#ecfeff', borde: '#0891b2', titulo: '#164e63', meta: '#08c6f5' }, 
];

// guarda el índice de color asignado a cada ramo
  private coloresAsignados: { [nombreRamo: string]: number } = {};
  private contadorColor: number = 0;

  getColorRamo(nombreRamo: string) {
  if (this.coloresAsignados[nombreRamo] === undefined) {
    this.coloresAsignados[nombreRamo] = this.contadorColor % this.colores.length;
    this.contadorColor++;
  }
  return this.colores[this.coloresAsignados[nombreRamo]];
}


  // Guarda la información interna de la tarjeta y la habilita para ser arrastrada
  guardarConfiguracionSeccion(seccion: Seccion) {
    if (seccion.sala) {
      seccion.guardado = true;
    } else {
      alert('Por favor, asigne una sala antes de guardar.');
    }
  }

  // Permite editar nuevamente la tarjeta si se requiere cambiar datos
  editarConfiguracionSeccion(seccion: Seccion) {
    seccion.guardado = false;
    // Si ya estaba en la grilla, la removemos al editar sus propiedades base
    seccion.dia = undefined;
    seccion.modulo = undefined;
  }

  // --- Lógica  Drag & Drop ---
  
  // Se ejecuta en el costado izquierdo al empezar a arrastrar una tarjeta válida
  onDragStart(event: DragEvent, seccion: Seccion) {
    if (!seccion.guardado) {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData('text/plain', seccion.id.toString());
  }

  // Previene el comportamiento por defecto en las celdas para permitir el Drop
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  // Se ejecuta cuando soltamos la sección dentro de una celda específica del horario
onDrop(event: DragEvent, dia: string, moduloId: number) {
  event.preventDefault();
  const seccionIdStr = event.dataTransfer?.getData('text/plain');
  
  if (seccionIdStr) {
    const seccionId = parseInt(seccionIdStr, 10);
    
    // se busca la sección modificada dentro de los ramos
    let seccionConDatos: Seccion | undefined;
    for (const ramo of this.ramos) {
      seccionConDatos = ramo.secciones.find(s => s.id === seccionId);
      if (seccionConDatos) break;
    }
    
    // si se encuentra, se actualiza también la lista de 'secciones' que lee la grilla
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

  // Permite remover un bloque de la grilla y devolverlo al panel izquierdo
  removerDeGrilla(seccion: Seccion) {
    seccion.dia = undefined;
    seccion.modulo = undefined;
  }

  aplicarFiltro() {
    console.log('Aplicando filtro para:', this.nivelSeleccionado);
  }
}