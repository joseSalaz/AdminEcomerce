import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { LibroService } from '../../../service/libro.service';
import { Router } from '@angular/router';
import { Libro } from '../../../models/libro';

@Component({
  selector: 'app-mantenimiento-libro',
  templateUrl: './mantenimiento-libro.component.html',
  styleUrl: './mantenimiento-libro.component.scss'
})
export class MantenimientoLibroComponent {

  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  @Output() close = new EventEmitter<void>();
  

  @Input() libro: Libro = {
    idLibro: 0,
    titulo: '',
    isbn: undefined,
    tamanno: '',
    descripcion: '',
    condicion: '',
    impresion: '',
    tipoTapa: '',
    estado: true,
    idSubcategoria: 0,
    idTipoPapel: 0,
    idProveedor: 0,
    imagen: '',  
    precioVenta: undefined,
  };

  imageFile: File | null = null;
  

  constructor(private libroService: LibroService, private router: Router) {}

  // Método para seleccionar la imagen
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.imageFile = input.files[0];
    }
  }
  showAlert(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
      this.showSuccessAlert = true;
      setTimeout(() => this.showSuccessAlert = false, 3000);  // La alerta desaparece después de 3 segundos
    } else if (type === 'error') {
      this.errorMessage = message;
      this.showErrorAlert = true;
      setTimeout(() => this.showErrorAlert = false, 3000);  // La alerta desaparece después de 3 segundos
    }
  }
  

  onSubmit(): void {
    // Limpiar las alertas antes de enviar el formulario
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successMessage = '';
    this.errorMessage = '';
  
    if (this.libro.idLibro === 0) {
      // Crear nuevo libro (con imagen)
      if (this.imageFile) {
        this.libroService.createLibro(this.libro, this.imageFile).subscribe(
          (response) => {
            console.log('Libro creado con éxito:', response);
            this.libro.imagen = response.imagen;
            this.showAlert('success', 'Libro creado con éxito.');
            // Restablecer los valores para crear un nuevo libro
            this.libro = {
              idLibro: 0,
              titulo: '',
              isbn: undefined,
              tamanno: '',
              descripcion: '',
              condicion: '',
              impresion: '',
              tipoTapa: '',
              estado: true,
              idSubcategoria: 0,
              idTipoPapel: 0,
              idProveedor: 0,
              imagen: '',
              precioVenta: undefined,
            };
            this.onClose(); // Cerrar el modal
          },
          (error) => {
            console.error('Error al crear el libro:', error);
            this.showAlert('error', 'Error al crear el libro.');
          }
        );
      } else {
        this.showAlert('error', 'Debe seleccionar una imagen.');
      }
    } else {
      // Editar libro existente (sin enviar imagen)
      this.libroService.updateLibro(this.libro).subscribe(
        (response) => {
          console.log('Libro editado con éxito:', response);
          this.showAlert('success', 'Libro editado con éxito.');
          this.onClose(); // Cerrar el modal
        },
        (error) => {
          console.error('Error al editar el libro:', error);
          this.showAlert('error', 'Error al editar el libro.');
        }
      );
    }
  }
  
  

  // Método para cerrar el modal
  onClose() {
    // Restablecer alertas
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successMessage = '';
    this.errorMessage = '';
  
    // Restablecer el libro a su estado inicial
    this.libro = {
      idLibro: 0,
      titulo: '',
      isbn: undefined,
      tamanno: '',
      descripcion: '',
      condicion: '',
      impresion: '',
      tipoTapa: '',
      estado: true,
      idSubcategoria: 0,
      idTipoPapel: 0,
      idProveedor: 0,
      imagen: '',
      precioVenta: undefined,
    };
  
    // Emitir evento de cierre
    this.close.emit();
  }
  


}
