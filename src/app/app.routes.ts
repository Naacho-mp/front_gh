import { Routes } from '@angular/router';
import { Horario } from './pages/horario/horario';
import { Docentes} from './pages/docentes/docentes';
import { Secciones } from './pages/secciones/secciones';
import { Ramos } from './pages/ramos/ramos';
import { Salas } from './pages/salas/salas';
import { LoginComponent } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { RecuperarPass } from './pages/recuperar-pass/recuperar-pass';


export const routes: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent}, 
  { path: 'recuperar-pass', component: RecuperarPass},
  {
    path: '', component: MainLayout, 
    children: [
    { path: 'horario', component: Horario },
    { path: 'docentes', component: Docentes },
    { path: 'salas', component: Salas },
    { path: 'ramos', component: Ramos },
    { path: 'secciones', component: Secciones },
    { path: '**', redirectTo: 'horario' },
    ]
  }
];