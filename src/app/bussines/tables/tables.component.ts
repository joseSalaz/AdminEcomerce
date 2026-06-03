import { Component, OnInit } from '@angular/core';
import { LibroService } from '../../service/libro.service';
import { Libro } from '../../models/libro';
import { SubCategoriaService } from '../../service/subcategoria.service';
import { Categoria, SubCategoria } from '../../models/subcategoria';
import { CategoriaService } from '../../service/categoria.service';
import { forkJoin } from 'rxjs';
import { Precio } from '../../models/precio';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent implements OnInit {


  libros: Libro[] = [];
  subCategorias: SubCategoria[] = [];
  subCategoriasPaginas: SubCategoria[] = [];
  totalSubCategorias: number = 0;
  categoriasMap: Map<number, string> = new Map();
  currentPage = 1;
  pageSize = 10;
  currentPageSubCategorias = 1;
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  libroSeleccionado: Libro | null = null;
  precio: Precio[] = [];  // Inicializa el precio
  Stock: number = 0;
  precioVenta: number = 0;
  categorias: Categoria[] = [];
  subcategoria: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };
  subcategoriaSeleccionada: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };
  categoria: Categoria = { idCategoria: 0, categoria1: '' }; // Nueva categoría
  isEditSubcategoriaMode = false;
  isCategoriaModalOpen = false;
  isSubcategoriaModalOpen: boolean = false;
  estadoSeleccionado?: boolean ;
  tituloBuscado: string = '';
  totalItems: number = 0; // Total de libros obtenidos de la API
  totalPages: number = 0; // Número total de páginas
  hasMoreData: boolean = true; // Indica si hay más datos para mostrar
  constructor(
    private libroService: LibroService,
    private subCategoriaService: SubCategoriaService,
    private categoriaService: CategoriaService,

  ) {

  }
  // ngOnChanges(): void {
  //   if (this.libros) {
  //     this.formulario.reset(this.libros); 
  //   }
  // }
  ngOnInit() {
    this.getLibrosPaginados(this.currentPage);
    this.getSubCategorias(),
      this.getCategorias();
  }
  getCategorias() {
    this.categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data; // Guardar categorías para el select
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }
  deleteSub(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subCategoriaService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'La subcategoría ha sido eliminada.',
              'success'
            );
            this.getSubCategorias();
          },
          error: (error) => {
            console.error("Error al eliminar:", error);
            Swal.fire(
              'Error',
              'No se pudo eliminar la subcategoría.',
              'error'
            );
          }
        });
      }
    });
  }
  openSubcategoriaModal(isEditMode: boolean, subcategoria?: SubCategoria) {

    this.isEditSubcategoriaMode = isEditMode;
    if (isEditMode && subcategoria) {
      // Si es modo edición, inicializamos con los datos de la subcategoría seleccionada
      this.subcategoriaSeleccionada = { ...subcategoria };
    } else {
      // Si es modo creación, inicializamos con un objeto vacío
      this.subcategoriaSeleccionada = { id: 0, descripcion: '', idCategoria: 0 };
    }
    this.isSubcategoriaModalOpen = true; // Abrimos el modal
    document.body.classList.add('overflow-hidden'); // Evitamos scroll en el fondo
  }

  openeditmodal() {

  }
  closeSubcategoriaModal() {
    this.isSubcategoriaModalOpen = false; // Cerramos el modal
    document.body.classList.remove('overflow-hidden'); // Habilitamos el scroll
  }


  handleSubcategoriaGuardada() {
    this.getSubCategorias(); // Refrescar lista de subcategorías
    this.closeSubcategoriaModal(); // Cerrar el modal
  }

  // Método para abrir el modal
  openCreateModal(): void {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.libroSeleccionado = null;
    document.body.classList.add('overflow-hidden');
  }


  // Método para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
    this.Stock = 0;
    this.precioVenta = 0
    document.body.classList.remove('overflow-hidden');
  }
  handleLibroGuardado(): void {
    this.getLibrosPaginados(this.currentPage); // Refrescar lista de libros
    this.closeModal(); // Cerrar el modal
    console.log('Libro guardado, actualizando lista...');
  }

  openEditModal(libro: Libro): void {
    this.isEditMode = true; // Modo edición
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
      error: (err) => {
        console.error('Error al obtener datos:', err);
      },
    });
    this.isModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  getLibros() {
    this.libroService.getList().subscribe(
      (data: Libro[]) => {
        this.libros = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener libros:', error);
      }
    );
  }

  getLibrosPaginados(page: number) {
    this.libroService.getPaginatedLibros(page, this.pageSize).subscribe(
      (data: Libro[]) => {
        this.libros = data;
        this.hasMoreData = this.libros.length === this.pageSize;
      },
      (error) => {
        console.error('Error al obtener libros:', error);
      }
    );
  }

  deleteLibro(id: number) {
    this.libroService.updateestado(id).subscribe({
      next: () => {
        Swal.fire(
          '¡Inactivo!',
          'El libro cambió a inactivo',
          'success'
        );
        this.getLibrosPaginados(this.currentPage); // Recarga los datos de la tabla
      },
      error: (error) => {
        console.error("Error al cambiar estado:", error);
        Swal.fire(
          'Error',
          'No se pudo cambiar el estado del libro',
          'error'
        );
      }
    });
  }

  buscar(): void {
    this.currentPage = 1; // Reiniciar a la primera página al buscar
    this.filtrarLibros(); // Llamar al filtro con título y estado
  }
  
  mostrarTodos(): void {
    this.tituloBuscado = '';
    this.estadoSeleccionado = undefined;
    this.currentPage = 1; // Reiniciar paginación
    this.getLibrosPaginados(this.currentPage); // Cargar todos los libros sin filtro
  }
  
  filtrarLibros(): void {
    this.libroService.filtrarLibros(this.estadoSeleccionado, this.tituloBuscado, this.currentPage, this.pageSize)
      .subscribe(
        (response) => {
          this.libros = response.libros;
          this.totalItems = response.totalItems;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Calcula el total de páginas
          this.hasMoreData = this.libros.length === this.pageSize; // Si la cantidad recibida es menor, no hay más datos
        },
        (error) => {
          console.error('Error al obtener libros filtrados:', error);
        }
      );
  }
  
  nextPage() {
    if (this.hasMoreData) { // Verifica si hay más datos antes de avanzar
      this.currentPage++;
      if (this.tituloBuscado || this.estadoSeleccionado !== undefined) {
        this.filtrarLibros(); // Si hay filtro, usa la búsqueda filtrada
      } else {
        this.getLibrosPaginados(this.currentPage); // Si no hay filtro, usa la lista paginada normal
      }
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.tituloBuscado || this.estadoSeleccionado !== undefined) {
        this.filtrarLibros(); // Si hay filtro, usa la búsqueda filtrada
      } else {
        this.getLibrosPaginados(this.currentPage); // Si no hay filtro, usa la lista paginada normal
      }
    }
  }
  
  
  getSubCategorias() {
    this.subCategoriaService.getList().subscribe(
      (subCategorias: SubCategoria[]) => {
        this.subCategorias = subCategorias;  // Guardamos todas las subcategorías
        this.totalSubCategorias = subCategorias.length;  // Establecemos el total para la paginación
        this.paginarSubCategorias();  // Actualizamos la vista de subcategorías
        // Cargar las categorías relacionadas con las subcategorías
        subCategorias.forEach(subCategoria => {
          this.categoriaService.getCategoriaById(subCategoria.idCategoria).subscribe(
            (categoria: Categoria) => {
              this.categoriasMap.set(subCategoria.idCategoria, categoria.categoria1);
            },
            (error) => {
              console.error('Error al obtener la categoría:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener subcategorías:', error);
      }
    );
  }

  /// Método para actualizar la tabla de subcategorías según la página
// Método para actualizar la paginación
paginarSubCategorias() {
  const startIndex = (this.currentPageSubCategorias - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.subCategoriasPaginas = this.subCategorias.slice(startIndex, endIndex);
  this.totalPages = Math.ceil(this.totalSubCategorias / this.pageSize); // Asegurar total de páginas
}

// Métodos de paginación
nextPageSubCategorias() {
  if (this.currentPageSubCategorias < this.totalPages) {
    this.currentPageSubCategorias++;
    this.paginarSubCategorias();
  }
}

prevPageSubCategorias() {
  if (this.currentPageSubCategorias > 1) {
    this.currentPageSubCategorias--;
    this.paginarSubCategorias();
  }
}


  editListSubCategoria() {
    console.log("editando");
  }

  deleteSubCategoria() {
    console.log("Eliminado");
  }

//filtro subcategorias
categoriaSeleccionada?: number;
pagina: number = 1;
tamanioPagina: number = 10;
subcategorias: any[] = [];
totalPaginas: number = 1;
buscarsub() {
  this.subCategoriasPaginas = []; // Limpiar antes de buscar
  this.subCategoriaService.obtenerSubcategorias(this.categoriaSeleccionada, this.pagina, this.pageSize).subscribe(
    (response: any) => {
      console.log(response); // Verifica qué datos llegan
      this.subCategoriasPaginas = response.subcategorias;
      this.totalItems = response.totalItems;
      this.totalPages = response.totalPages;
    },
    error => console.error('Error al obtener subcategorías', error)
  );
}


mostrarTodas() {
  this.categoriaSeleccionada = undefined;
  this.pagina = 1;
  this.buscar();
}

cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
    this.pagina = nuevaPagina;
    this.buscar();
  }
}




}
