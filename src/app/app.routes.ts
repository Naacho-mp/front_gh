import { Routes } from '@angular/router';
import { Horario } from './pages/horario/horario';
import { Docentes} from './pages/docentes/docentes';
import { Secciones } from './pages/secciones/secciones';
import { Ramos } from './pages/ramos/ramos';
import { Salas } from './pages/salas/salas';

export const routes: Routes = [
  { path: '', redirectTo: 'horario', pathMatch: 'full' },
  { path: 'horario', component: Horario },
  { path: 'docentes', component: Docentes },
  { path: 'salas', component: Salas },
  { path: 'ramos', component: Ramos },
  { path: 'secciones', component: Secciones },

  { path: '**', redirectTo: 'horario' }
];
