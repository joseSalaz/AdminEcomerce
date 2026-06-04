import { Component, OnInit } from '@angular/core';
import { SubCategoriaService } from '../../../service/subcategoria.service';
import { Categoria, SubCategoria } from '../../../models/subcategoria';
import { CategoriaService } from '../../../service/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-subcategoria',
  templateUrl: './list-subcategoria.component.html',
  styleUrl: './list-subcategoria.component.scss'
})
export class ListSubcategoriaComponent implements OnInit {

  subCategorias: SubCategoria[] = [];
  subCategoriasPaginas: SubCategoria[] = [];
  totalSubCategorias: number = 0;
  categoriasMap: Map<number, string> = new Map();
  
  pageSize = 10;
  currentPageSubCategorias = 1;
  totalPagesSub: number = 1;

  categorias: Categoria[] = [];
  subcategoriaSeleccionada: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };
  isEditSubcategoriaMode = false;
  isSubcategoriaModalOpen: boolean = false;

  categoriaSeleccionada?: number;
  pagina: number = 1;

  constructor(
    private subCategoriaService: SubCategoriaService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.getSubCategorias();
    this.getCategorias();
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data: Categoria[]) => this.categorias = data,
      error: (error:any) => console.error('Error al cargar categorías:', error)
    });
  }

  getSubCategorias() {
    this.subCategoriaService.getList().subscribe({
      next: (subCategorias: SubCategoria[]) => {
        this.subCategorias = subCategorias;
        this.totalSubCategorias = subCategorias.length;
        this.paginarSubCategorias();
        
        subCategorias.forEach(subCategoria => {
          this.categoriaService.getCategoriaById(subCategoria.idCategoria).subscribe({
            next: (categoria: Categoria) => {
              this.categoriasMap.set(subCategoria.idCategoria, categoria.categoria1);
            },
            error: (error:any) => console.error('Error al obtener la categoría:', error)
          });
        });
      },
      error: (error:any) => console.error('Error al obtener subcategorías:', error)
    });
  }

  paginarSubCategorias() {
    const startIndex = (this.currentPageSubCategorias - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.subCategoriasPaginas = this.subCategorias.slice(startIndex, endIndex);
    this.totalPagesSub = Math.ceil(this.totalSubCategorias / this.pageSize);
  }

  nextPageSubCategorias() {
    if (this.currentPageSubCategorias < this.totalPagesSub) {
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

  buscarsub() {
    this.subCategoriasPaginas = []; 
    this.subCategoriaService.obtenerSubcategorias(this.categoriaSeleccionada, this.pagina, this.pageSize).subscribe({
      next: (response: any) => {
        this.subCategoriasPaginas = response.subcategorias;
        this.totalSubCategorias = response.totalItems;
        this.totalPagesSub = response.totalPages;
      },
      error: (error:any) => console.error('Error al obtener subcategorías', error)
    });
  }

  mostrarTodas() {
    this.categoriaSeleccionada = undefined;
    this.pagina = 1;
    this.getSubCategorias();
  }

  openSubcategoriaModal(isEditMode: boolean, subcategoria?: SubCategoria) {
    this.isEditSubcategoriaMode = isEditMode;
    if (isEditMode && subcategoria) {
      this.subcategoriaSeleccionada = { ...subcategoria };
    } else {
      this.subcategoriaSeleccionada = { id: 0, descripcion: '', idCategoria: 0 };
    }
    this.isSubcategoriaModalOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  closeSubcategoriaModal() {
    this.isSubcategoriaModalOpen = false;
    document.body.classList.remove('overflow-hidden');
  }

  handleSubcategoriaGuardada() {
    this.getSubCategorias();
    this.closeSubcategoriaModal();
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
            Swal.fire('¡Eliminado!', 'La subcategoría ha sido eliminada.', 'success');
            this.getSubCategorias();
          },
          error: (error:any) => {
            console.error("Error al eliminar:", error);
            Swal.fire('Error', 'No se pudo eliminar la subcategoría.', 'error');
          }
        });
      }
    });
  }
}