import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './bussines/dashboard/dashboard.component';
import { TablesComponent } from './bussines/tables/tables.component';
import { ProfileComponent } from './bussines/profile/profile.component'; 
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './bussines/profile/login/login.component';
import { GraficoProductosComponent } from './bussines/dashboard/grafico-productos/grafico-productos.component';
import { NotificacionesComponent } from './bussines/notificaciones/notificaciones.component';
import { PersonaComponent } from './bussines/profile/persona/persona.component';
import { UsuarioComponent } from './bussines/profile/usuario/usuario.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Ruta de login pública
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [AuthGuard], // Protege todas las rutas hijas
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'profile', component: ProfileComponent },
      {path:'grafico',component:GraficoProductosComponent},
      {path:'reportes',component:NotificacionesComponent},
      {path:'personas',component:PersonaComponent},
      {path:'usuario',component:UsuarioComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' } // Redirige rutas no encontradas al login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
