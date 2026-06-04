import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LibroService } from '../../../service/libro.service';
import { Router } from '@angular/router';
import { Libro } from '../../../models/libro';
import { SubCategoria } from '../../../models/subcategoria';
import { SubCategoriaService } from '../../../service/subcategoria.service';
import { TipoPapelService } from '../../../service/tipo-papel.service';
import { ProvedorService } from '../../../service/provedor.service';
import { TipoPapel } from '../../../models/tipo_papel';
import { Provedor } from '../../../models/provedor';
import { Autor } from '../../../models/autor';
import { AutorService } from '../../../service/autor.service';
import { Libroconautor } from '../../../models/libroConAutor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenimiento-libro',
  templateUrl: './mantenimiento-libro.component.html',
  styleUrl: './mantenimiento-libro.component.scss'
})
export class MantenimientoLibroComponent implements OnInit {

  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  // SE ELIMINÓ LA VARIABLE 'autores' REDUNDANTE
  autorSuggestions: Autor[] = [];
  libroSeleccionado: Autor | null = null; 
  author: any = {};
  isAutorNotFound: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() libroGuardado = new EventEmitter<void>();
  
  autorNombre: string = '';
  imageUrl: string | ArrayBuffer | null = null;
  @Input() isEditMode: boolean = false;

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
  };

  autorSeleccionado: Autor | null = null; 
  @Input() precioVenta: number = 0;
  @Input() Stock: number = 0;
  
  tiposPapel: TipoPapel[] = [];
  subCategoria: SubCategoria[] = [];
  provedor: Provedor[] = [];
  autoresFiltrados: Autor[] = []; 
  buscarAutor: string = ''; 
  imageFile: File | null = null;
  mostrarMensaje: boolean = false;
  mostrarModalCrearAutor: boolean = false;

  constructor(
    private libroService: LibroService,
    private subCategoriaService: SubCategoriaService,
    private tipoPapelService: TipoPapelService,
    private provedorService: ProvedorService,
    private autorService: AutorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSubcategorias();
    this.loadTiposPapel();
    this.loadProveedores();
    
  }

  recibirAutor(autor: Autor): void {
    this.autorSeleccionado = autor;
    console.log('Autor recibido:', autor);
  }

  loadSubcategorias(): void {
    this.subCategoriaService.getList().subscribe(
      (data) => this.subCategoria = data,
      (error) => console.error('Error al cargar subcategorías:', error)
    );
  }

  loadTiposPapel(): void {
    this.tipoPapelService.getTipoPapel().subscribe(
      (data) => this.tiposPapel = data,
      (error) => console.error('Error al cargar tipos de papel:', error)
    );
  }

  loadProveedores(): void {
    this.provedorService.getProveedor().subscribe(
      (data) => this.provedor = data,
      (error) => console.error('Error al cargar proveedores:', error)
    );
  }

  buscarAutores(): void {
    if (this.buscarAutor.trim().length > 0) {
      this.autorService.searchAutor(this.buscarAutor).subscribe(
        (data) => {
          this.autoresFiltrados = Array.isArray(data) ? data : [data];
          this.mostrarMensaje = this.autoresFiltrados.length === 0;
        },
        (error) => {
          console.error('Error al buscar autores:', error);
          this.autoresFiltrados = [];
          this.mostrarMensaje = true;
        }
      );
    } else {
      this.mostrarMensaje = false;
      this.autoresFiltrados = [];
    }
  }

  abrirCrearAutorModal(): void {
    this.mostrarModalCrearAutor = true;
  }

  cerrarCrearAutorModal(): void {
    this.mostrarModalCrearAutor = false;
  }

  recibirAutorCreado(autor: Autor): void {
    this.autoresFiltrados = [autor];
    this.buscarAutor = `${autor.nombre} ${autor.apellido}`;
    this.cerrarCrearAutorModal();
    this.mostrarMensaje = false;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageUrl = null;
    const input = document.getElementById('imagen') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  onSubmit(): void {
    const libroConAutorRequest: Libroconautor = {
      libro: {
        idLibro: this.libro.idLibro,
        titulo: this.libro.titulo,
        isbn: this.libro.isbn,
        tamanno: this.libro.tamanno,
        descripcion: this.libro.descripcion,
        condicion: this.libro.condicion,
        impresion: this.libro.impresion,
        tipoTapa: this.libro.tipoTapa,
        estado: this.libro.estado,
        idSubcategoria: Number(this.libro.idSubcategoria),
        idTipoPapel: Number(this.libro.idTipoPapel),
        idProveedor: Number(this.libro.idProveedor),
        imagen: ''
      },
      autor: this.autorSeleccionado || null
    };

    const formData = new FormData();
    formData.append('request.libro.idLibro', libroConAutorRequest.libro.idLibro?.toString() || '');
    formData.append('request.libro.titulo', libroConAutorRequest.libro.titulo || '');
    formData.append('request.libro.isbn', libroConAutorRequest.libro.isbn?.toString() || '');
    formData.append('request.libro.tamanno', libroConAutorRequest.libro.tamanno || '');
    formData.append('request.libro.descripcion', libroConAutorRequest.libro.descripcion || '');
    formData.append('request.libro.condicion', libroConAutorRequest.libro.condicion || '');
    formData.append('request.libro.impresion', libroConAutorRequest.libro.impresion || '');
    formData.append('request.libro.tipoTapa', libroConAutorRequest.libro.tipoTapa || '');
    formData.append('request.libro.estado', libroConAutorRequest.libro.estado.toString());
    formData.append('request.libro.idSubcategoria', libroConAutorRequest.libro.idSubcategoria.toString());
    formData.append('request.libro.idTipoPapel', libroConAutorRequest.libro.idTipoPapel.toString());
    formData.append('request.libro.idProveedor', libroConAutorRequest.libro.idProveedor.toString());

    if (libroConAutorRequest.autor) {
      formData.append('request.autor.idAutor', libroConAutorRequest.autor.idAutor.toString());
      formData.append('request.autor.nombre', libroConAutorRequest.autor.nombre || '');
      formData.append('request.autor.apellido', libroConAutorRequest.autor.apellido || '');
      formData.append('request.autor.codigo', libroConAutorRequest.autor.codigo?.toString() || '');
      formData.append('request.autor.descripcion', libroConAutorRequest.autor.descripcion || '');
    } else {
      formData.append('request.autor', null as any);
    }

    if (this.imageFile) {
      formData.append('imageFile', this.imageFile, this.imageFile.name);
    }

    if (this.libro.idLibro === 0) {
      this.libroService.createLibro(formData, this.precioVenta, this.Stock).subscribe(
        (response) => {
          Swal.fire({ title: "Creado Correctamente", icon: "success", draggable: true });
          this.onClose();
          this.libroGuardado.emit();
        },
        (error) => {
          console.error('Error al crear el libro:', error);
          Swal.fire({ title: "No se pudo crear", icon: "error", draggable: true });
        }
      );
    } else {
      this.libroService.updateLibro(formData, this.precioVenta, this.Stock).subscribe(
        (response) => {
          Swal.fire({ title: "Actualizado Correctamente", icon: "success", draggable: true });
          this.onClose();
          this.libroGuardado.emit();
        },
        (error) => {
          console.error('Error al actualizar el libro:', error);
          Swal.fire({ title: "Error al Actualizar", icon: "error", draggable: true });
        }
      );
    }
  }

  onClose() {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.precioVenta = 0;
    this.Stock = 0;

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
    };

    this.close.emit();
  }

  abrirCrearNuevoAutor(): void {
    this.autorSeleccionado = null;
    this.isAutorNotFound = false;
  }

  seleccionarAutor(autor: Autor): void {
    this.buscarAutor = `${autor.nombre} ${autor.apellido}`;
    this.autorSeleccionado = autor;
    this.autoresFiltrados = [];
  }
}