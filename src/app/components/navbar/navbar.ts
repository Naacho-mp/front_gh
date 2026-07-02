import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  
  // Variables dinámicas que se pintarán en la interfaz
  nombreUsuario: string = 'Cargando...';
  inicialUsuario: string = 'U';
  
  // Suscripción para escuchar los cambios del usuario logueado
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit() {
    // Nos suscribimos al flujo del servicio. Cuando el backend responda en el login, esto se activará.
    this.userSubscription = this.authService.usuarioActual$.subscribe({
      next: (res) => {
        
        if (res && res.usuario) {

          this.nombreUsuario = res.usuario.nombre;
          this.inicialUsuario = this.nombreUsuario.charAt(0).toUpperCase();
        } else {
          // Estado por defecto si no hay nadie logueado
          this.nombreUsuario = 'Invitado';
          this.inicialUsuario = 'I';
        }
      },
      error: (err) => {
        console.error('Error al obtener el usuario en el Navbar:', err);
        this.nombreUsuario = 'Error';
        this.inicialUsuario = '?';
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Cierra el menú automáticamente si el usuario hace click afuera de la sección del perfil
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-user')) {
      this.menuOpen = false;
    }
  }

  onCerrarSesion() {
    this.menuOpen = false;
    
    //Limpiamos el estado del usuario en el servicio 
    this.authService.logout(); 
    
    // Redirigimos al login
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      this.snackBar.open(`Has cerrado sesión exitosamente`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-success'] 
        });
    }
  }
}