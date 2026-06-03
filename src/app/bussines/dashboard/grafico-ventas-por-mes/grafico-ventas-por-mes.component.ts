import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { VentaService } from '../../../service/venta.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatoIngreso, IngresoMensual } from '../../../models/IngresoMensual';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-grafico-ventas-por-mes',
  templateUrl: './grafico-ventas-por-mes.component.html',
  styleUrls: ['./grafico-ventas-por-mes.component.scss']
})
export class GraficoVentasPorMesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Ingresos Mensuales',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw as number; // Convertimos explícitamente a número
            return `S/. ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `S/. ${value}`;
          }
        }
      }
    }
  };
  

  meses = [
    { nombre: 'Enero', valor: 1 }, { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 }, { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 }, { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 }, { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 }, { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 }, { nombre: 'Diciembre', valor: 12 }
  ];

  anios = [2023, 2024, 2025, 2026];

  mesInicio: number;
  anioInicio: number;
  mesFin: number;
  anioFin: number;

  constructor(private ventasService: VentaService,
    private cdr: ChangeDetectorRef
  ) {
    const today = new Date();
    this.mesInicio = today.getMonth() + 1;
    this.anioInicio = today.getFullYear();
    this.mesFin = this.mesInicio;
    this.anioFin = this.anioInicio;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatearFecha(anio: number, mes: number): string {
    return `${anio}-${mes.toString().padStart(2, '0')}`;
  }

  cargarDatos(): void {
    const fechaInicio = this.formatearFecha(this.anioInicio, this.mesInicio);
    const fechaFin = this.formatearFecha(this.anioFin, this.mesFin);

    const inicioDate = new Date(this.anioInicio, this.mesInicio - 1);
    const finDate = new Date(this.anioFin, this.mesFin - 1);

    if (finDate < inicioDate) {
      Swal.fire(
                    'Error',
                    'La fecha final no puede ser anterior a la fecha inicial',
                    'error'
                  );
      return;
    }

    this.ventasService.obtenerIngresosMensuales(
      `${fechaInicio}-01`,
      `${fechaFin}-${new Date(this.anioFin, this.mesFin, 0).getDate()}` // Get last day of the month
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos: IngresoMensual[]) => {
          if (Array.isArray(datos)) {
            this.actualizarGrafico(datos.map(d => ({
              mesAnio: d.mesAño,
              totalIngresos: Number(d.totalIngresos)
            })));
          } else {
            console.error('Los datos recibidos no tienen el formato esperado:', datos);
            this.mostrarGraficoVacio();
          }
        },
        error: (error) => {
          console.error('Error al cargar los datos:', error);
          this.mostrarGraficoVacio();
        }
      });
  }


  private mostrarGraficoVacio(): void {
    this.chartData.labels = [];
    this.chartData.datasets[0].data = [];
  }

  private formatearEtiquetaMes(mesAnio: string): string {
    const [anio, mes] = mesAnio.split('-');
    const mesNombre = this.meses.find(m => m.valor === +mes)?.nombre || 'Desconocido';
    return `${mesNombre} ${anio}`;
  }

  private actualizarGrafico(datos: DatoIngreso[]): void {
    if (!datos.length) {
      this.mostrarGraficoVacio();
      return;
    }
  
    datos.sort((a, b) => a.mesAnio.localeCompare(b.mesAnio));
  
    this.chartData = {
      labels: datos.map(d => this.formatearEtiquetaMes(d.mesAnio)),
      datasets: [{
        data: datos.map(d => d.totalIngresos),
        label: 'Ingresos Mensuales',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  
    this.cdr.detectChanges(); // Forzar actualización del gráfico
  }
  
  obtenerMesMasVendido(): string {
    if (!this.chartData.datasets || this.chartData.datasets.length === 0) return 'N/A';
  
    const dataset = this.chartData.datasets[0];
    if (!dataset.data || dataset.data.length === 0) return 'N/A';
  
    const dataValues = dataset.data as number[]; // Aseguramos que sea un array de números
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));
  
    const labels = this.chartData.labels as string[]; // Convertimos a array de strings
    return labels[maxIndex] ?? 'N/A';
  }
  
  
}