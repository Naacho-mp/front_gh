import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-modulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-modulo.html',
  styleUrls: ['./header-modulo.css']
})
export class HeaderModuloComponent {
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() textoBotonPrincipal: string = '';
  @Input() iconoBotonPrincipal: string = 'pi-plus';

  // Eventos para avisar al componente padre cuando se hace clic
  @Output() accionPrincipal = new EventEmitter<void>();
  @Output() accionExcel = new EventEmitter<void>();
}