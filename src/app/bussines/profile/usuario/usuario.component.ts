import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonaService } from '../../../service/persona.service';
import { UsuarioService } from '../../../service/usuario.service';
import { Usuario } from '../../../models/usuario';
import { Persona } from '../../../models/persona';
import { HttpClient } from '@angular/common/http';
import { CriptoService } from '../../../service/cripto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
  @Input() usuario: Partial<Usuario> = {};  // ✅ ESTA ES LA CORRECTA (DEJARLA)

  personasEncontradas: Persona[] = [];
  personas: Persona[] = [];
  nombrePersona: string = '';
  buscarRealizado: boolean = false;
  mostrandoResultados = false;
  nombreBusqueda: string = '';
  mostrarModalPersona: boolean = false;
  nombrePersonaSeleccionada: string = '';
  mostrarPassword = false;
  esEdicion = false;
  textoEncriptadoOriginal: string | null = null;
  passwordDesencriptada: string | null = null;

  @Output() usuarioCreado = new EventEmitter<Usuario>();
  @Output() cerrar = new EventEmitter<void>();

  constructor(
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
    private criptoService: CriptoService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.esEdicion = !!this.usuario?.idUsuario;
    if (this.usuario.idPersona) {
      this.obtenerPersonaPorId(this.usuario.idPersona);
    }
    console.log('Usuario recibido:', this.usuario); // ✅ Verifica si recibe datos al editar
  }

  obtenerPersonaPorId(idPersona: number) {
    this.personaService.getbyId(idPersona).subscribe({
      next: (persona) => {
        this.nombrePersona = `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`;
      },
      error: () => {
        this.nombrePersona = "No encontrada";
      }
    });
  }
  buscarPersona() {
    if (!this.nombrePersona.trim()) {
      alert("Ingrese un nombre para buscar");
      return;
    }

    this.personaService.buscarPorNombre(this.nombrePersona).subscribe(
      (data) => {
        this.personasEncontradas = data;
        this.buscarRealizado = true;
      },
      (error) => {
        this.personasEncontradas = [];
        this.buscarRealizado = true;
        Swal.fire(
          'Error',
          'Persona no encontrada. Ingrese bien el nombre o cree una nueva',
          'error'
        );
      }
    );
  }
  abrirModalPersona() {
    this.mostrarModalPersona = true;
  }
  cerrarModalPersona() {
    this.mostrarModalPersona = false;
  }
  personaCreada(persona: Persona) {
    this.usuario.idPersona = persona.idPersona;
    this.nombrePersona = `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`; // Mostrar en el input
    this.cerrarModalPersona();
  }

  seleccionarPersona(persona: Persona) {
    this.usuario.idPersona = persona.idPersona;
    this.nombrePersona = `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`; // Mostrar el nombre en el input
    this.personasEncontradas = []; // Ocultar la lista después de seleccionar
  }
  limpiarBusqueda() {
    this.nombrePersona = ''; // Limpia el input
    this.personasEncontradas = []; // Borra los resultados
  }
  guardarUsuario() {
    if (!this.usuario.username) {
      alert("Debe ingresar un usuario");
      return;
    }
    if (!this.usuario.idPersona) {
      alert("Debe seleccionar una persona válida.");
      return;
    }

    // Datos a enviar
    const usuarioData: any = {
      idUsuario: this.usuario.idUsuario,
      username: this.usuario.username,
      cargo: this.usuario.cargo,
      estado: this.usuario.estado,
      idPersona: this.usuario.idPersona
    };

    if (!this.usuario.idUsuario) {
      // Si es creación, incluir contraseña obligatoriamente
      usuarioData.password = this.usuario.password;
    } else if (this.usuario.password && this.usuario.password.trim() !== "") {
      // Si es edición, solo enviar password si se cambió
      usuarioData.password = this.usuario.password;
    }

    if (!this.usuario.idUsuario) {
      this.usuarioService.crearUsuario(usuarioData).subscribe({
        next: (usuarioCreado) => {
          this.usuarioCreado.emit(usuarioCreado);
          this.cerrar.emit();
          this.resetForm();
          Swal.fire(
            '¡Creado!',
            'El Usuario a Sido creado',
            'success'
          );
        },
        error: (err) => {
          Swal.fire(
            'Error',
            'No se pudo crear al usuario.',
            'error'
          );
          console.error("Error al crear el usuario:", err);
        }
      });
    } else {
      this.usuarioService.actualizarUsuario(usuarioData).subscribe({
        next: () => {
          alert("Usuario actualizado correctamente");
          this.usuarioCreado.emit();
          this.cerrar.emit();
          this.resetForm();
          this.mostrarPassword = false;
        },
        error: (err) => {
          console.error("Error al actualizar el usuario:", err);
        }
      });
    }
  }


  cerrarModal() {
    this.cerrar.emit();
  }

  resetForm() {
    this.usuario = {
      username: '',
      password: '',
      cargo: '',
      estado: true,
      idPersona: undefined
    };
    this.nombreBusqueda = '';
  }

  ocultarPassword() {
    this.mostrarPassword = false;
  }

  togglePasswordVisibility() {
    if (!this.mostrarPassword) {

      if (this.passwordDesencriptada) {
        this.mostrarPassword = true;
        return;
      }
      if (!this.usuario.password) return;
      this.criptoService
        .desencriptarPassword(this.usuario.password)
        .subscribe({
          next: (response) => {
            this.passwordDesencriptada = response.decryptedText;
            this.mostrarPassword = true;
          }
        });

    } else {
      this.mostrarPassword = false;
    }
  }


}
