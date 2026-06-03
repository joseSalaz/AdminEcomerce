import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubCategoriaService } from '../../../service/subcategoria.service';
import { CategoriaService } from '../../../service/categoria.service';
import { Categoria, SubCategoria } from '../../../models/subcategoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matenimiento-sub-categoria',
  templateUrl: './matenimiento-sub-categoria.component.html',
  styleUrl: './matenimiento-sub-categoria.component.scss'
})
export class MatenimientoSubCategoriaComponent {
  @Input() isEditMode: boolean = false;
  @Input() subcategoria: SubCategoria = { id: 0, descripcion: '', idCategoria: 0 };
  @Output() close = new EventEmitter<void>();
  @Output() subcategoriaGuardada = new EventEmitter<void>();

  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private subCategoriaService: SubCategoriaService
  ) {}

  ngOnInit() {
    this.getCategorias(); // Cargar categorías al iniciar
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  closeModal() {
    this.close.emit(); // Emitimos evento de cierre al padre
  }

  onSubmit() {
    if (this.isEditMode) {
      // Si es edición
      this.subCategoriaService.update(this.subcategoria).subscribe(
        () => {
          this.subcategoriaGuardada.emit(); // Emitimos el evento de guardado
          this.closeModal();
                    Swal.fire({
                      title: "Actualizado Correctamente",
                      icon: "success",
                      draggable: true
                    });
        },
        (error) =>           
          Swal.fire({
          title: "Error al Actualizar",
          icon: "error",
          draggable: true
        })  
      );
    } else {
      // Si es creación
      this.subCategoriaService.createSubcategoria(this.subcategoria).subscribe(
        () => {
          this.subcategoriaGuardada.emit(); // Emitimos el evento de guardado
          this.closeModal();
          Swal.fire({
            title: "Creado Correctamente",
            icon: "success",
            draggable: true
          });
        },
        (error) =>  
          Swal.fire({
          title: "Error al crear",
          icon: "error",
          draggable: true
        })  
      );
    }
  }
}
