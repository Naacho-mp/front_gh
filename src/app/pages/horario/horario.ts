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

  // Datos maestros para los selectores internos de las tarjetas
  docentesDisponibles: string[] = ['Dr. Arancibia', 'Mg. Gomez', 'Ing. Vera', 'Dra. Muñoz'];
  salasDisponibles: string[] = ['Sala 201', 'Lab. Computación', 'Lab. 18.2', 'Sala 105'];

  // Definición de la estructura de la grilla horaria
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

  // Listado inicial de secciones del nivel cargado
  secciones: Seccion[] = [
    { id: 1, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S1', docente: '', sala: '', guardado: false },
    { id: 2, ramo: 'Cálculo Diferencial', codigo: 'INF-102-S2', docente: '', sala: '', guardado: false },
    { id: 3, ramo: 'Álgebra Lineal', codigo: 'INF-103-S1', docente: '', sala: '', guardado: false },
    { id: 4, ramo: 'Física Mecánica', codigo: 'INF-104-S1', docente: '', sala: '', guardado: false },
    
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
  ];


  // Guarda la información interna de la tarjeta y la habilita para ser arrastrada
  guardarConfiguracionSeccion(seccion: Seccion) {
    if (seccion.docente && seccion.sala) {
      seccion.guardado = true;
    } else {
      alert('Por favor, asigne un docente y una sala antes de guardar.');
    }
  }

  // Permite editar nuevamente la tarjeta si se requiere cambiar datos
  editarConfiguracionSeccion(seccion: Seccion) {
    seccion.guardado = false;
    // Si ya estaba en la grilla, la removemos al editar sus propiedades base
    seccion.dia = undefined;
    seccion.modulo = undefined;
  }

  // --- Lógica Nativa Drag & Drop ---
  
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
      const seccionTarget = this.secciones.find(s => s.id === seccionId);
      
      if (seccionTarget) {
        // Asignamos las coordenadas de tiempo en la grilla
        seccionTarget.dia = dia;
        seccionTarget.modulo = moduloId;
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
    // Aquí puedes añadir lógica con servicios para recargar "this.secciones" desde tu backend
  }
}