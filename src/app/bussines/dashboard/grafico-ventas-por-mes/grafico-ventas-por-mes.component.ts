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
      label: 'Ingresos Netos',
      backgroundColor: '#10b981', // Verde esmeralda moderno para ingresos financieros
      hoverBackgroundColor: '#059669',
      borderRadius: 8, // Barras redondeadas
      borderSkipped: false,
      borderWidth: 0
    }]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: {
            size: 13,
            weight: 'bold',
            family: "'Inter', system-ui, sans-serif"
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: "'Inter', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 13 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            let value = context.raw as number;
            return ` Ingresos: S/. ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: "'Inter', sans-serif" }
        }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#64748b',
          font: { size: 12, family: "'Inter', sans-serif" },
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

  constructor(private ventasService: VentaService, private cdr: ChangeDetectorRef) {
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
      Swal.fire('Error', 'La fecha final no puede ser anterior a la fecha inicial', 'error');
      return;
    }

    this.ventasService.obtenerIngresosMensuales(
      `${fechaInicio}-01`,
      `${fechaFin}-${new Date(this.anioFin, this.mesFin, 0).getDate()}`
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
            console.error('Formato no esperado:', datos);
            this.mostrarGraficoVacio();
          }
        },
        error: (error) => {
          console.error('Error al cargar datos:', error);
          this.mostrarGraficoVacio();
        }
      });
  }

  private mostrarGraficoVacio(): void {
    this.chartData = {
      labels: [],
      datasets: [{ ...this.chartData.datasets[0], data: [] }]
    };
    this.cdr.detectChanges();
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
        ...this.chartData.datasets[0],
        data: datos.map(d => d.totalIngresos)
      }]
    };

    this.cdr.detectChanges();
  }

  obtenerMesMasVendido(): string {
    if (!this.chartData.datasets || this.chartData.datasets.length === 0) return 'N/A';
    const dataset = this.chartData.datasets[0];
    if (!dataset.data || dataset.data.length === 0) return 'N/A';

    const dataValues = dataset.data as number[];
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));
    const labels = this.chartData.labels as string[];
    return labels[maxIndex] ?? 'N/A';
  }
}