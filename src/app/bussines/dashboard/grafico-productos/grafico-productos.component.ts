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
        label: 'Unidades Vendidas',
        backgroundColor: '#2563eb', // Azul sólido moderno (Tailwind blue-600)
        hoverBackgroundColor: '#1d4ed8', // Azul más oscuro al pasar el cursor
        borderRadius: 10, // Esquinas superiores redondeadas en las barras
        borderSkipped: false,
        borderWidth: 0
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
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          font: {
            size: 13,
            weight: 'bold', 
            family: "'Inter', system-ui, sans-serif"
          },
          padding: 25
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          autoSkip: false,     
          maxRotation: 45,     
          minRotation: 0,      
          color: '#64748b',
          font: {
            size: 10,          
            weight: 'normal',  
            family: "'Inter', system-ui, sans-serif"
          },
          padding: 10
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            family: "'Inter', system-ui, sans-serif"
          },
          padding: 10
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
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
  nombreMesActual: string = ''; // Nueva variable para pintar el título dinámico en el HTML

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

    this.nombreMesActual = mesEncontrado.nombre;

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

  private formatearTitulo(titulo: string): string {
    const maxLength = 20; // Reducido un poco para obligar al salto de línea y que use mejor el espacio horizontal expandido
    if (titulo.length <= maxLength) return titulo;

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