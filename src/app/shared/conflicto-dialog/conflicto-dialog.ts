import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conflicto-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conflicto-dialog.html',
  styleUrl: './conflicto-dialog.css',
})
export class ConflictoDialog {
  @Input() visible: boolean = false;
  @Input() titulo: string = 'Conflicto de Horario detectado';
  @Input() detalles: string[] = [];

  @Output() cerrar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }
}