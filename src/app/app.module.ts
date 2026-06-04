import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TablesComponent } from './bussines/tables/tables.component';
import { HttpClientModule } from '@angular/common/http';
import { MantenimientoLibroComponent } from './bussines/tables/mantenimiento-libro/mantenimiento-libro.component';
import { FormsModule } from '@angular/forms';
import { MatenimientoAutorComponent } from './bussines/tables/matenimiento-autor/matenimiento-autor.component';
import { MatenimientoSubCategoriaComponent } from './bussines/tables/matenimiento-sub-categoria/matenimiento-sub-categoria.component';
import { LoginComponent } from './bussines/profile/login/login.component';
import { GraficoProductosComponent } from './bussines/dashboard/grafico-productos/grafico-productos.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './bussines/dashboard/dashboard.component';
import { NotificacionesComponent } from './bussines/notificaciones/notificaciones.component';
import { GraficoVentasPorMesComponent } from './bussines/dashboard/grafico-ventas-por-mes/grafico-ventas-por-mes.component';
import { PersonaComponent } from './bussines/profile/persona/persona.component';
import { UsuarioComponent } from './bussines/profile/usuario/usuario.component';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './bussines/profile/profile.component';
import { ListLibroComponent } from './bussines/tables/list-libro/list-libro.component';
import { ListSubcategoriaComponent } from './bussines/tables/list-subcategoria/list-subcategoria.component';
import { ListAutorComponent } from './bussines/tables/list-autor/list-autor.component';





@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    TablesComponent,
    MantenimientoLibroComponent,
    MatenimientoAutorComponent,
    MatenimientoSubCategoriaComponent,
    LoginComponent,
    GraficoProductosComponent,
    DashboardComponent,
    NotificacionesComponent,
    GraficoVentasPorMesComponent,
    PersonaComponent,
    UsuarioComponent,
    ProfileComponent,
    ListLibroComponent,
    ListSubcategoriaComponent,
    ListAutorComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
