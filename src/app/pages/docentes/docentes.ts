import { Component, ChangeDetectorRef, OnInit } from '@angular/core'; // 1. Importamos OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DocenteFormComponent } from '../../forms/forms-docente/forms-docente';
import { DisponibilidadDocenteComponent } from './disponibilidad-docente/disponibilidad-docente';
import { DocenteService, Docente, DisponibilidadSlot } from '../../services/docente.service';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarDialog } from '../../shared/confirmar-dialog/confirmar-dialog';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './docentes.html',
  styleUrl: './docentes.css',
})
export class Docentes implements OnInit { 
  searchName = '';
  filterType = '';
  currentPage = 1;
  readonly perPage = 5;
  estadoModal: boolean = false;

  //Propiedad local que manejará la tabla
  docentes: Docente[] = [];

  mostrarModalImportar = false;
  archivoSeleccionado: File | null = null;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private docenteService: DocenteService,
    private snackBar: MatSnackBar
  ) {}

  // cargar los datos del servicio apenas salga el componente
  ngOnInit(): void {
    this.docentes = this.docenteService.getAll();
  }

  get totalDocentes(): number { return this.docentes.length; }
  get totalFullTime(): number { return this.docentes.filter(d => d.contrato === 'Full-time').length; }
  get totalPartTime(): number { return this.docentes.filter(d => d.contrato === 'Part-time').length; }

  abrirRegistro(): void {
    this.dialog.open(DocenteFormComponent, {
      width: '560px',
      disableClose: true,
    }).afterClosed().subscribe((result) => {
      if (result) {
        const contrato = (result.tipo_contrato === 'full-time'
          ? 'Full-time' 
          : 'Part-time') as 'Full-time' | 'Part-time';
        
        const disponibilidad: DisponibilidadSlot[] = [];

        if (contrato === 'Part-time' && result.matrizDisponibilidad) {
          for (let modIndex = 0; modIndex < 12; modIndex++) {
            const slot = {
              modulo: modIndex + 1,
              lunes:     result.matrizDisponibilidad[0]?.[modIndex] ?? false,
              martes:    result.matrizDisponibilidad[1]?.[modIndex] ?? false,
              miercoles: result.matrizDisponibilidad[2]?.[modIndex] ?? false,
              jueves:    result.matrizDisponibilidad[3]?.[modIndex] ?? false,
              viernes:   result.matrizDisponibilidad[4]?.[modIndex] ?? false,
              sabado:    result.matrizDisponibilidad[5]?.[modIndex] ?? false,
            };
            
            const tieneAlgunDia = Object.values(slot).some(
              (v, i) => i > 0 && v === true
            );
            if (tieneAlgunDia) disponibilidad.push(slot);
          }
        }
        
        const nuevoDocente: Omit<Docente, 'id'> = {
          nombre: result.nombre_completo,
          contrato: contrato,
          disponibilidad: disponibilidad
        };
        
        this.docenteService.agregar(nuevoDocente);
        
        // Sincronizamos la vista
        this.docentes = this.docenteService.getAll();
        this.cdr.detectChanges();

        this.snackBar.open(`El Docente "${nuevoDocente.nombre}" ha sido registrado correctamente`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-success']
        });
      }
    });
  }

  get filtrados(): Docente[] {
    return this.docentes.filter(d =>
      d.nombre.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || d.contrato === this.filterType)
    );
  }

  get paginados(): Docente[] {
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

  disponibilidad(docente: Docente): void {
    this.dialog.open(DisponibilidadDocenteComponent, {
      width: '900px',
      maxWidth: '95vh',
      maxHeight: '90vh',
      panelClass: 'modal-disponibilidad',
      data: {
        id: docente.id,
        nombre: docente.nombre,
        contrato: docente.contrato,
        disponibilidad: docente.disponibilidad ?? []
      }
    });
  }

  editar(d: Docente) { console.log('Editar', d); }

  //Eliminar con notificacion de que realmente se eliminó
  eliminar(d: Docente): void {
    this.dialog.open(ConfirmarDialog, {
      width: '350px',
      data: {
        titulo: 'ELIMINAR DOCENTE',
        mensaje: `¿Estás seguro que deseas eliminar al Docente <strong>"${d.nombre}"</strong>? Esta acción eliminará toda la información asociada a este Docente.`,
        boton: 'Eliminar',
        tipo: 'eliminar'
      }
    }).afterClosed().subscribe(confirmado => {
      if (confirmado === true) {
        // El servicio limpia el registro de su estado interno
        this.docenteService.eliminar(d.id);
        this.docentes = this.docenteService.getAll();
  
        if (this.paginados.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.cdr.detectChanges();

        this.snackBar.open(`El Docente "${d.nombre}" ha sido eliminado correctamente`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-eliminar']
        });
      }
    });
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  subir(): void {
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

      const nuevosDocentes: Docente[] = filasRaw.map(fila => {
        let tipoContrato: 'Full-time' | 'Part-time' = 'Full-time';
        const contratoRaw = String(fila['Tipo de contrato'] || fila['contrato'] || '').trim();
        if (contratoRaw.toLowerCase().includes('part')) {
          tipoContrato = 'Part-time';
        }

        return {
          id: String(fila['ID Docente'] || fila['id'] || '').trim(),
          nombre: String(fila['Nombre del docente'] || fila['nombre'] || 'Docente sin nombre').trim(),
          contrato: tipoContrato
        };
      }).filter(doc => doc.id !== '');

      if (nuevosDocentes.length > 0) {
        // Modificación para el Excel: Para que la importación persista tras un cambio de vista,
        // guardamos individualmente los registros procesados en el servicio.
        nuevosDocentes.forEach(doc => {
          this.docenteService.agregar(doc);
        });
        
        this.docentes = this.docenteService.getAll();
        this.currentPage = 1;
        this.cdr.detectChanges();
      }

      this.mostrarModalImportar = false;
      this.archivoSeleccionado = null;
    };

    lector.readAsBinaryString(this.archivoSeleccionado);
  }
}