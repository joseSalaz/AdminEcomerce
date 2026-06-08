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
  mesesCargando: { [key: number]: boolean } = {};
  constructor(private ventaService: VentaService) { }

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
    // 1. Usamos "mes" en lugar de "i"
    this.mesesCargando[mes] = true;

    if (this.anioSeleccionado > this.anioActual ||
      (this.anioSeleccionado === this.anioActual && mes > this.mesActual)) {
      this.mesesCargando[mes] = false; // Liberamos el botón si entra a la validación
      return;
    }

    this.ventaService.generarReporteExcel(this.anioSeleccionado, mes + 1).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Ventas_${mes + 1}_${this.anioSeleccionado}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);

        // 2. Usamos "mes" para apagar el spinner al finalizar con éxito
        this.mesesCargando[mes] = false;
      },
      error: (err) => {
        console.error('Error al generar reporte:', err);

        // 3. ¡IMPORTANTE! Apagamos el spinner también en caso de error
        this.mesesCargando[mes] = false;

        Swal.fire(
          'Oops...',
          'Verifica si este mes tiene ventas',
          'warning'
        );
      }
    });
  }


}
