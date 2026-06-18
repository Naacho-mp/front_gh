import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DisponibilidadSlot {
  modulo: number;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
}

export interface DocenteDialogData {
  id: string;
  nombre: string;
  contrato: 'Full-time' | 'Part-time';
  disponibilidad: DisponibilidadSlot[];
}

interface ModuloHorario {
  numero: number;
  horario: string;
}

@Component({
  selector: 'app-disponibilidad-docente',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './disponibilidad-docente.html',
  styleUrl: './disponibilidad-docente.css'
})
export class DisponibilidadDocenteComponent implements OnInit {

  readonly DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  readonly DIAS_LABELS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SÁB'];

  readonly MODULOS: ModuloHorario[] = [
    { numero: 1,  horario: '08:30 - 09:30' },
    { numero: 2,  horario: '09:35 - 10:35' },
    { numero: 3,  horario: '10:50 - 11:50' },
    { numero: 4,  horario: '11:55 - 12:55' },
    { numero: 5,  horario: '13:10 - 14:10' },
    { numero: 6,  horario: '14:30 - 15:30' },
    { numero: 7,  horario: '15:35 - 16:35' },
    { numero: 8,  horario: '16:50 - 17:50' },
    { numero: 9,  horario: '17:55 - 18:55' },
    { numero: 10, horario: '19:10 - 20:10' },
    { numero: 11, horario: '20:15 - 21:15' },
    { numero: 12, horario: '21:20 - 22:20' },
  ];

  private disponibilidadMap = new Map<number, DisponibilidadSlot>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DocenteDialogData,
    private dialogRef: MatDialogRef<DisponibilidadDocenteComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.contrato === 'Full-time') {
      // Full-time: todos los módulos disponibles en todos los días
      this.MODULOS.forEach(m => {
        this.disponibilidadMap.set(m.numero, {
          modulo: m.numero,
          lunes: true, martes: true, miercoles: true,
          jueves: true, viernes: true, sabado: true
        });
      });
    } else {
      // Part-time: solo los módulos registrados al momento del registro
      this.data.disponibilidad?.forEach(slot => {
        this.disponibilidadMap.set(slot.modulo, slot);
      });
    }
  }

  isDisponible(modulo: number, dia: string): boolean {
    const slot = this.disponibilidadMap.get(modulo);
    if (!slot) return false;
    return slot[dia as keyof DisponibilidadSlot] as boolean;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  getIniciales(): string {
  const partes = this.data.nombre.trim().split(' ');
  const primera = partes[0]?.[0] ?? '';
  const segunda = partes[1]?.[0] ?? '';
  return (primera + segunda).toUpperCase();
}



}