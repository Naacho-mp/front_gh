import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SalaFormComponent } from '../../forms/forms-sala/forms-sala';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalasService, Sala } from '../../services/sala.service';
import { ConfirmarDialog } from '../../shared/confirmar-dialog/confirmar-dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salas.html',
  styleUrl: './salas.css',
})
export class Salas implements OnInit, OnDestroy {
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;

  salas: Sala[] = [];
  private salasSub!: Subscription;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private salasService: SalasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Escuchamos el BehaviorSubject de las salas de forma permanente
    this.salasSub = this.salasService.getAll().subscribe({
      next: (data) => {
        this.salas = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al escuchar flujo de salas:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.salasSub) {
      this.salasSub.unsubscribe();
    }
  }

   abrirFormulario(sala?: Sala): void {
    this.dialog.open(SalaFormComponent, {
      width: '560px',
      disableClose: true,
      data: sala ?? null
    }).afterClosed().subscribe((result) => {
      if (!result) return;

      if (sala) {
        // edición
        this.salasService.editar(sala.id, {
          nombre:    result.nombre,
          tipo:      result.tipo,
          capacidad: Number(result.capacidad)
        });
        this.snackBar.open(`La Sala "${result.nombre}" ha sido actualizada correctamente`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-success']
        });
      } else {
        // registro nuevo
        this.salasService.agregar({
          nombre:    result.nombre,
          tipo:      result.tipo,
          capacidad: Number(result.capacidad)
        });
        this.snackBar.open(`La Sala "${result.nombre}" ha sido registrada correctamente`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-success']
        });
      }
    });
  }

  get totalSalas(): number { return this.salas.length; }
  get totalLaboratorio(): number { return this.salas.filter(s => s.tipo === 'Laboratorio').length; }
  get totalSala(): number { return this.salas.filter(s => s.tipo === 'Sala').length; }

  get filtrados(): Sala[] {
    return this.salas.filter(s =>
      s.nombre.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || s.tipo === this.filterType)
    );
  }

  get paginados(): Sala[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filtrados.slice(start, start + this.perPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtrados.length / this.perPage));
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilter() { this.currentPage = 1; }

  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  disponibilidad(s: Sala) {
    console.log('Consultando disponibilidad de:', s.nombre);
  }

 eliminar(s: Sala): void {
    this.dialog.open(ConfirmarDialog, {
      width: '350px',
      data: {
        titulo: 'ELIMINAR SALA',
        mensaje: `¿Estás seguro que deseas eliminar la Sala <strong>"${s.nombre}"</strong>?`,
        boton: 'Eliminar',
        tipo: 'eliminar'
      }
    }).afterClosed().subscribe(confirmado => {
      if (confirmado === true) {
        this.salasService.eliminar(s.id);

        if (this.paginados.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.snackBar.open(`La Sala "${s.nombre}" ha sido eliminada correctamente`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-eliminar']
        });
      }
    });
  }
}