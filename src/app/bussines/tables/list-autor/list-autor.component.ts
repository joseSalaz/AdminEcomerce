import { Component, OnInit } from '@angular/core';
import { AutorService } from '../../../service/autor.service'; 
import { Autor } from '../../../models/autor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-autor',
  templateUrl: './list-autor.component.html',
  styleUrl: './list-autor.component.scss'
})
export class ListAutorComponent implements OnInit {

  autores: Autor[] = [];
  buscarTexto: string = '';
  cargando: boolean = false;
//por Ahora para le Paginado
  paginaActual: number = 1;
  itemsPorPagina: number = 20;

  // Control del modal de mantenimiento de autor
  mostrarModalAutor: boolean = false;
  autorSeleccionado: Autor | null = null;
  esModoEdicion: boolean = false;

  constructor(private autorService: AutorService) { }

  ngOnInit(): void {
    this.cargarAutores();
  }

  cargarAutores(): void {
    this.cargando = true;
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.paginaActual = 1; // Resetea a la primera página al cargar datos
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }

get autoresPaginados(): Autor[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.autores.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.autores.length / this.itemsPorPagina);
  }

  // Métodos de navegación
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  // Realiza búsquedas reactivas/por botón utilizando el método del servicio
  filtrarAutores(): void {
    if (this.buscarTexto.trim().length > 0) {
      this.cargando = true;
      this.autorService.searchAutor(this.buscarTexto).subscribe({
        next: (data) => {
          this.autores = Array.isArray(data) ? data : [data];
          this.paginaActual = 1; // Resetea página al buscar
          this.cargando = false;
        },
        error: () => {
          this.autores = [];
          this.cargando = false;
        }
      });
    } else {
      this.cargarAutores();
    }
  }

  // Abre el modal para crear un nuevo autor
  abrirModalCrear(): void {
    this.autorSeleccionado = { idAutor: 0, nombre: '', apellido: '', codigo: undefined, descripcion: '' };
    this.esModoEdicion = false;
    this.mostrarModalAutor = true;
    this.bloquearScroll(true);
  }

  // Abre el modal para editar un autor existente
  abrirModalEditar(autor: Autor): void {
    this.autorSeleccionado = { ...autor }; 
    this.esModoEdicion = true;
    this.mostrarModalAutor = true;
    this.bloquearScroll(true);
  }

  cerrarModalAutor(): void {
    this.mostrarModalAutor = false;
    this.autorSeleccionado = null;
    this.bloquearScroll(false);
  }

  
  onAutorGuardado(): void {
    this.cargarAutores();
    this.cerrarModalAutor();
  }

  eliminarAutor(autor: Autor): void {
    Swal.fire({
      title: `¿Eliminar a ${autor.nombre} ${autor.apellido}?`,
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado', 'El autor ha sido eliminado correctamente.', 'success');
      }
    });
  }
  // Método ayudante para controlar el body
  private bloquearScroll(bloquear: boolean) {
    if (bloquear) {
      document.body.classList.add('overflow-hidden', 'md:pr-4'); 
    } else {
      document.body.classList.remove('overflow-hidden', 'md:pr-4');
    }
  }
}