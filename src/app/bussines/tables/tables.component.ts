import { Component, OnInit } from '@angular/core';
import { LibroService } from '../../service/libro.service';
import { Libro } from '../../models/libro';
import { SubCategoriaService } from '../../service/subcategoria.service';
import { Categoria, SubCategoria } from '../../models/subcategoria';
import { CategoriaService } from '../../service/categoria.service';
import { forkJoin } from 'rxjs';
import { Precio } from '../../models/precio';
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent  implements OnInit{


  libros: Libro[] = [];
  subCategorias:SubCategoria[]=[];
  subCategoriasPaginas: SubCategoria[] = [];
  totalSubCategorias: number = 0;
  categoriasMap: Map<number, string> = new Map();
  currentPage = 1;
  pageSize = 10;
  currentPageSubCategorias = 1;  
  isModalOpen: boolean = false;
  libroSeleccionado: Libro | null = null;
  precio: Precio[]=[];  // Inicializa el precio
  Stock: number = 0; 
  precioVenta: number=0;
  constructor( 
    private libroService : LibroService,
    private subCategoriaService : SubCategoriaService,
    private categoriaService: CategoriaService
  ){

  }
  // ngOnChanges(): void {
  //   if (this.libros) {
  //     this.formulario.reset(this.libros); 
  //   }
  // }
  ngOnInit() {
    this.getLibrosPaginados(this.currentPage);
    this.getSubCategorias()
  }
    // Método para abrir el modal
    openCreateModal(): void {
      this.isModalOpen = true;
      document.body.classList.add('overflow-hidden'); // Bloquear scroll
    }
  
    // Método para cerrar el modal
    closeModal(): void {
      this.isModalOpen = false;
      this.libroSeleccionado = null;
      this.precioVenta = 0;
      this.Stock=0;
      document.body.classList.remove('overflow-hidden'); // Habilitar scroll
      
    }

    openEditModal(libro: Libro): void {
      this.libroSeleccionado = libro;  // Asignar el libro seleccionado al modal
      forkJoin({
        precio: this.libroService.getPrecioById(libro.idLibro),  // Obtener el precio
        kardex: this.libroService.getStockById(libro.idLibro)    // Obtener el stock
      }).subscribe({
        next: (response) => {
          if (Array.isArray(response.precio) && response.precio.length > 0) {
            this.precioVenta = response.precio[0].precioVenta;  // Acceder al primer elemento del array
          } else {
            console.warn('El precio no se recibió como un objeto esperado');
          }
          this.Stock = response.kardex.stock;  // Asignar el stock recibido
        },
        error: (err) => {
          console.error('Error al obtener datos:', err);
        }
      });
      this.isModalOpen = true;  // Abrir el modal
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
      },
      (error) => {
        console.error('Error al obtener libros:', error);
      }
    );
  }
  editListLibros(){
    console.log("editando"); 
  }
  deleteLibro(){
    console.log("Eliminado");  
  }

  nextPage() {
    this.currentPage++;
    this.getLibrosPaginados(this.currentPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getLibrosPaginados(this.currentPage);
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

  // Método para actualizar la tabla de subcategorías según la página
  paginarSubCategorias() {
    const startIndex = (this.currentPageSubCategorias - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.subCategoriasPaginas = this.subCategorias.slice(startIndex, endIndex);
  }

  // Métodos de paginación de subcategorías
  nextPageSubCategorias() {
    if (this.currentPageSubCategorias * this.pageSize < this.totalSubCategorias) {
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

  editListSubCategoria(){
    console.log("editando"); 
  }

  deleteSubCategoria(){
    console.log("Eliminado");  
  }


}
