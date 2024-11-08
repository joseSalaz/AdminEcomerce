import { Component, OnInit } from '@angular/core';
import { LibroService } from '../../service/libro.service';
import { Libro } from '../../models/libro';
import { SubCategoriaService } from '../../service/subcategoria.service';
import { Categoria, SubCategoria } from '../../models/subcategoria';
import { CategoriaService } from '../../service/categoria.service';

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

  constructor( 
    private libroService : LibroService,
    private subCategoriaService : SubCategoriaService,
    private categoriaService: CategoriaService
  ){

  }
  ngOnInit() {
    this.getLibrosPaginados(this.currentPage);
    this.getSubCategorias()
  }
    // Método para abrir el modal
    openCreateModal(): void {
      this.isModalOpen = true;
    }
  
    // Método para cerrar el modal
    closeModal(): void {
      this.isModalOpen = false;
      console.log("secierra");
      
    }

      // Método para abrir el modal en modo de edición
  openEditModal(libro: Libro): void {
    this.libroSeleccionado = { ...libro };  // Clona el objeto para evitar cambios accidentales
    this.isModalOpen = true;
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
