import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './Pages/Default/layout/default-layout/default-layout.component';
import { DefaultHeaderComponent } from './Pages/Default/default-header/default-header.component';
import { DefaultFotterComponent } from './Pages/Default/default-fotter/default-fotter.component';
import { TablesComponent } from './Pages/views/tables/tables.component';
import { ReportsComponent } from './Pages/views/reports/reports.component';
import { DashboardComponent } from './Pages/views/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    DefaultHeaderComponent,
    DefaultFotterComponent,
    DashboardComponent,
    TablesComponent,
    ReportsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,

    BrowserAnimationsModule
  
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
