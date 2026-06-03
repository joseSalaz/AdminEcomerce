import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../service/venta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent implements OnInit {
  anioSeleccionado: number = new Date().getFullYear();
  anioActual: number = new Date().getFullYear();
  mesActual: number = new Date().getMonth();
  aniosDisponibles: number[] = [];
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.generarAniosDisponibles();
  }

  generarAniosDisponibles(): void {
    const anioInicio = this.anioActual - 5;
    const anioFin = this.anioActual; 
    this.aniosDisponibles = [];
    for (let i = anioFin; i >= anioInicio; i--) {
      this.aniosDisponibles.push(i);
    }
  }

  actualizarMesActual(): void {
    this.mesActual = this.anioSeleccionado < this.anioActual ? 11 : new Date().getMonth();
  }

  esMesDisponible(indiceMes: number): boolean {
    return this.anioSeleccionado < this.anioActual || indiceMes <= this.mesActual;
  }

  descargarExcel(mes: number): void {
    if (this.anioSeleccionado > this.anioActual || 
        (this.anioSeleccionado === this.anioActual && mes > this.mesActual)) {
      return;
    }
    
    this.ventaService.generarReporteExcel(this.anioSeleccionado, mes + 1).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Ventas_${mes+1}_${this.anioSeleccionado}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al generar reporte:', err);
       Swal.fire(
                           'Oops...',
                           'Verifica si este mes tiene ventas',
                           'warning'
                         );
      }
    });
}

  
}
