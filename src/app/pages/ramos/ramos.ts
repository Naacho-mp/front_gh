import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RamoFormComponent } from '../../forms/forms-ramo/forms-ramo';
import { RamosService, Ramo } from '../../services/ramo.service';
import { ConfirmarDialog } from '../../shared/confirmar-dialog/confirmar-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-ramos',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './ramos.html',
  styleUrl: './ramos.css',
})
export class Ramos implements OnInit, OnDestroy { 
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;

  mostrarModalImportar = false;
  archivoSeleccionado: File | null = null;

  ramos: Ramo[] = [];
  private ramosSub!: Subscription;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ramosService: RamosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.ramosSub = this.ramosService.getAll().subscribe({
      next: (data) => {
        this.ramos = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al escuchar el flujo de ramos:', err)
    });
  }

  //  se destruye la suscripción al salir para evitar fugas de memoria
  ngOnDestroy(): void {
    if (this.ramosSub) {
      this.ramosSub.unsubscribe();
    }
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.archivoSeleccionado = input.files[0]; 
    }
  }


  // Maneja la carga del documento Excel
  subirRamos(): void {
  if (!this.archivoSeleccionado) return;

  const lector = new FileReader();

  lector.onload = (e: ProgressEvent<FileReader>) => {
    const target = e.target;
    if (!target || !target.result) return;

    const datosBinarios = target.result;
    const libro = XLSX.read(datosBinarios, { type: 'binary' });
    const primeraHojaNombre = libro.SheetNames[0];
    const hoja = libro.Sheets[primeraHojaNombre];

    const filasRaw = XLSX.utils.sheet_to_json<any>(hoja);

    const nuevosRamos: Ramo[] = filasRaw.map(fila => ({
      id: String(fila['Código Ramo'] || fila['codigo'] || '').trim(),
      nombre: String(fila['Nombre Ramo'] || fila['nombre'] || 'Sin nombre').trim(),
      nivel: String(fila['Nivel'] || fila['nivel'] || 'I').trim(),
      cantidad_secciones: Number(fila['Cantidad Secciones'] || fila['Cantidad de Secciones'] || 0),
      cupos_por_seccion: Number(fila['Cupos Sección'] || fila['Cupos por Sección'] || 0),
      horas_catedra: Number(fila['Horas Cátedra'] || 0),
      horas_laboratorio: Number(fila['Horas Laboratorio'] || 0)
    })).filter(ramo => ramo.nombre !== 'Sin nombre');

    if (nuevosRamos.length > 0) {
      let exitosos = 0;
      let fallidos = 0;

    nuevosRamos.forEach(ramo => {
      const ok = this.ramosService.agregarDesdeExcel(ramo);
      if (ok) exitosos++;
      else fallidos++;
    });

    const msgExitosos = exitosos === 1 ? '1 ramo importado exitosamente' : `${exitosos} ramos importados exitosamente`;
    const msgFallidos = fallidos === 1 ? '1 ya existía' : `${fallidos} ramos existían anteriormente`;

    if (fallidos === 0) {
    this.snackBar.open(`Los ${exitosos} ramos han sido importados correctamente.`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-success']
     });
    } else if (exitosos === 0) {
      this.snackBar.open('Error, No se pudo importar ningún ramo. Verifica ramos duplicados.', 'Cerrar', { 
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-eliminar']
       });
    } else {
      this.snackBar.open(`${msgExitosos}. Mientras que ${msgFallidos}.`, 'Cerrar', { 
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-warning']
       });
    }
  }
    this.mostrarModalImportar = false;
    this.archivoSeleccionado = null;
    this.cdr.detectChanges();
  };

  lector.readAsBinaryString(this.archivoSeleccionado);
}

 abrirFormulario(ramo?: Ramo): void {
  this.dialog.open(RamoFormComponent, {
    width: '560px',
    disableClose: true,
    data: ramo ?? null  // null = registro nuevo, ramo = edición
  }).afterClosed().subscribe((result) => {
    if (!result) return;

    if (ramo) {
      // edición: actualizamos el ramo existente
      this.ramosService.editar(ramo.id, result);
      this.snackBar.open(`El Ramo "${result.nombre}" ha sido actualizado correctamente`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-success']
      });
    } else {
      // registro nuevo
      this.ramosService.agregar(result);
      this.snackBar.open(`El Ramo "${result.nombre}" ha sido registrado correctamente`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-success']
      });
    }
  });
}

  get filtrados(): Ramo[] {
    return this.ramos.filter(r =>
      r.nombre.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || r.nivel === this.filterType)
    );
  }

  get paginados(): Ramo[] {
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


  eliminar(d: Ramo): void {
    this.dialog.open(ConfirmarDialog, {
      width: '350px',
      data: {
        titulo: 'ELIMINAR RAMO',
        mensaje: `¿Estás seguro que deseas eliminar el Ramo <strong>"${d.nombre}"</strong>? Esta acción eliminará toda la información asociada a este ramo.`,
        boton: 'Eliminar',
        tipo: 'eliminar'
      }
    }).afterClosed().subscribe(confirmado => {
      if (confirmado === true){
        this.ramosService.eliminar(d.id);
        
        if (this.paginados.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.snackBar.open(`El Ramo "${d.nombre}" ha sido eliminado correctamente`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-eliminar']
        });
      }
    });
  }
}