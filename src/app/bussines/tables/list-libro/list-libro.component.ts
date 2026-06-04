import { Component, OnInit } from '@angular/core';
import { LibroService } from '../../../service/libro.service';
import { Libro } from '../../../models/libro';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-libro',
  templateUrl: './list-libro.component.html',
  styleUrl: './list-libro.component.scss'
})
export class ListLibroComponent implements OnInit {

  // Estado local e independiente para libros
  libros: Libro[] = [];
  currentPage = 1;
  pageSize = 10;
  
  // Filtros de búsqueda
  tituloBuscado: string = '';
  estadoSeleccionado?: boolean;

  // Paginación de libros
  totalItems: number = 0; 
  totalPages: number = 0; 
  hasMoreData: boolean = true; 

  // Control del modal de mantenimiento de libro
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  libroSeleccionado: Libro | null = null;
  Stock: number = 0;
  precioVenta: number = 0;

  constructor(private libroService: LibroService) {}

  ngOnInit() {
    this.getLibrosPaginados(this.currentPage);
  }

  getLibrosPaginados(page: number) {
    this.libroService.getPaginatedLibros(page, this.pageSize).subscribe({
      next: (data: Libro[]) => {
        this.libros = data;
        this.hasMoreData = this.libros.length === this.pageSize;
      },
      error: (error) => console.error('Error al obtener libros:', error)
    });
  }

  buscar(): void {
    this.currentPage = 1; 
    this.filtrarLibros(); 
  }
  
  mostrarTodos(): void {
    this.tituloBuscado = '';
    this.estadoSeleccionado = undefined;
    this.currentPage = 1; 
    this.getLibrosPaginados(this.currentPage); 
  }
  
  filtrarLibros(): void {
    this.libroService.filtrarLibros(this.estadoSeleccionado, this.tituloBuscado, this.currentPage, this.pageSize)
      .subscribe({
        next: (response:any) => {
          this.libros = response.libros;
          this.totalItems = response.totalItems;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize); 
          this.hasMoreData = this.libros.length === this.pageSize; 
        },
        error: (error:any) => console.error('Error al obtener libros filtrados:', error)
      });
  }
  
  nextPage() {
    if (this.hasMoreData) { 
      this.currentPage++;
      if (this.tituloBuscado || this.estadoSeleccionado !== undefined) {
        this.filtrarLibros();
      } else {
        this.getLibrosPaginados(this.currentPage);
      }
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.tituloBuscado || this.estadoSeleccionado !== undefined) {
        this.filtrarLibros();
      } else {
        this.getLibrosPaginados(this.currentPage);
      }
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.libroSeleccionado = null;
    this.isModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  openEditModal(libro: Libro): void {
    this.isEditMode = true; 
    this.libroSeleccionado = libro;
    
    forkJoin({
      precio: this.libroService.getPrecioById(libro.idLibro),
      kardex: this.libroService.getStockById(libro.idLibro),
    }).subscribe({
      next: (response) => {
        if (Array.isArray(response.precio) && response.precio.length > 0) {
          this.precioVenta = response.precio[0].precioVenta;
        } else {
          console.warn('El precio no se recibió como un objeto esperado');
        }
        this.Stock = response.kardex.stock;
      },
      error: (err) => console.error('Error al obtener datos del libro:', err)
    });

    this.isModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.Stock = 0;
    this.precioVenta = 0;
    document.body.classList.remove('overflow-hidden');
  }

  handleLibroGuardado(): void {
    this.getLibrosPaginados(this.currentPage); 
    this.closeModal(); 
  }

  deleteLibro(id: number) {
    this.libroService.updateestado(id).subscribe({
      next: () => {
        Swal.fire('¡Inactivo!', 'El libro cambió a inactivo', 'success');
        this.getLibrosPaginados(this.currentPage); 
      },
      error: (error:any) => {
        console.error("Error al cambiar estado:", error);
        Swal.fire('Error', 'No se pudo cambiar el estado del libro', 'error');
      }
    });
  }
}