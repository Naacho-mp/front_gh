import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SeccionFormComponent } from '../../forms/forms-seccion/forms-seccion';
import { SeccionesService, Seccion } from '../../services/seccion.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarDialog } from '../../shared/confirmar-dialog/confirmar-dialog';

@Component({
  selector: 'app-secciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './secciones.html',
  styleUrl: './secciones.css',
})
export class Secciones implements OnInit, OnDestroy {
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;

  secciones: Seccion[] = [];
  private seccionesSub!: Subscription;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private seccionesService: SeccionesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.seccionesSub = this.seccionesService.getAll().subscribe({
      next: (data) => {
        this.secciones = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al escuchar el flujo de secciones:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.seccionesSub) {
      this.seccionesSub.unsubscribe();
    }
  }

  abrirFormulario(seccion?: Seccion): void {
  this.dialog.open(SeccionFormComponent, {
    width: '560px',
    disableClose: true,
    data: seccion ?? null
  }).afterClosed().subscribe((result) => {
    if (!result) return;

    if (seccion) {
      this.seccionesService.editar(seccion.id, result);
      this.snackBar.open(`La Sección "${result.numero_seccion}" del ramo "${result.codigo_ramo}" ha sido actualizada correctamente`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-success']
      });
    } else {
      this.seccionesService.agregar(result);
      this.snackBar.open(`La Sección "${result.numero_seccion}" del ramo "${result.codigo_ramo}" ha sido registrada correctamente`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-success']
      });
    }
  });
}

  get filtrados(): Seccion[] {
  return this.secciones.filter(s =>
    s.codigo_ramo.toLowerCase().includes(this.searchName.toLowerCase()) &&
    (this.filterType === '' || String(s.numero_seccion) === this.filterType)
  );
}

  get paginados(): Seccion[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filtrados.slice(start, start + this.perPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtrados.length / this.perPage));
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilter() { 
    this.currentPage = 1; 
  }

  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  eliminar(s: Seccion): void {
  this.dialog.open(ConfirmarDialog, {
    width: '350px',
    data: {
      titulo: 'ELIMINAR SECCIÓN',
      mensaje: `¿Estás seguro que deseas eliminar la Sección <strong>"${s.codigo_ramo} - S-${s.numero_seccion}"</strong>? Esta acción eliminará toda la información asociada a esta sección.`,
      boton: 'Eliminar',
      tipo: 'eliminar'
    }
  }).afterClosed().subscribe(confirmado => {
    if (confirmado === true) {
      this.seccionesService.eliminar(s.id);

      if (this.paginados.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }

      this.snackBar.open(`La Sección "${s.codigo_ramo} - S-${s.numero_seccion}" ha sido eliminada correctamente`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar']
      });
    }
  });
}
}