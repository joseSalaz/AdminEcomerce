import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './Pages/Default/layout/default-layout/default-layout.component';
import { DashboardComponent } from './Pages/views/dashboard/dashboard.component';
import { TablesComponent } from './Pages/views/tables/tables.component';
import { ReportsComponent } from './Pages/views/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
