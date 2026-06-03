import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ProductosMasVendidosService } from '../../../service/productos-mas-vendidos.service';

@Component({
  selector: 'app-grafico-productos',
  templateUrl: './grafico-productos.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class GraficoProductosComponent implements OnInit {

  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Productos Más Vendidos del Mes',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Arial', sans-serif"
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 18,
          weight: 'bold',
          family: "'Arial', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 30
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
            family: "'Arial', sans-serif"
          },
          padding: 5
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Arial', sans-serif"
          }
        }
      }
    },
    layout: {
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15
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
  mesSeleccionado!: number;
  anioSeleccionado!: number;

  constructor(private productosService: ProductosMasVendidosService) { }

  ngOnInit(): void {

    const fechaActual = new Date();
    this.mesSeleccionado = fechaActual.getMonth() + 1; 
    this.anioSeleccionado = fechaActual.getFullYear();
    this.cargarDatos();
  }

  cargarDatos() {

    const mesEncontrado = this.meses.find(m => m.valor === Number(this.mesSeleccionado));

    if (!mesEncontrado) {
      console.error("El mes seleccionado no se encontró en la lista de meses.");
      return;
    }

    const mesNombre = mesEncontrado.nombre;

    // Clonamos las opciones para que Angular detecte cambios
    this.chartOptions = {
      ...this.chartOptions,
      plugins: {
        ...this.chartOptions.plugins,
        title: {
          ...this.chartOptions.plugins?.title,
          text: `Productos Más Vendidos - ${mesNombre} ${this.anioSeleccionado}`
        }
      }
    };

    this.productosService
      .obtenerProductosMasVendidos(this.mesSeleccionado, this.anioSeleccionado)
      .subscribe(data => {

        this.chartData = {
          ...this.chartData,
          labels: data.map(p => this.formatearTitulo(p.nombreProducto)),
          datasets: [
            {
              ...this.chartData.datasets[0],
              data: data.map(p => p.totalVendidos)
            }
          ]
        };

      });
  }


  // Método para formatear los títulos largos
  private formatearTitulo(titulo: string): string {
    const maxLength = 30;
    if (titulo.length <= maxLength) return titulo;

    // Divide el título en palabras
    const palabras = titulo.split(' ');
    let resultado = '';
    let lineaActual = '';

    for (const palabra of palabras) {
      if ((lineaActual + palabra).length > maxLength) {
        resultado += lineaActual.trim() + '\n';
        lineaActual = palabra + ' ';
      } else {
        lineaActual += palabra + ' ';
      }
    }

    return resultado + lineaActual.trim();
  }
}
