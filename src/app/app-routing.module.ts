import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './bussines/dashboard/dashboard.component';
import { TablesComponent } from './bussines/tables/tables.component';
import { ProfileComponent } from './bussines/profile/profile.component'; 

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Cambiado a `component` en lugar de `loadComponent`
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Redirección al dashboard por defecto
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
