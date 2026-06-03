import { Component, Input } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { Usuario } from '../../models/usuario';
import { PersonaService } from '../../service/persona.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  usuarios: Usuario[] = [];
  mostrarModalUsuario = false; // Variable para el modal
  usuarioSeleccionado: any = null;
  nombrePersona : string = "";
  constructor(private usuarioService: UsuarioService,
    private personaService: PersonaService
  ) { }
  @Input() usuario: Partial<Usuario> = {}; // ✅ Esto inicializa un objeto vacío compatible con la interfaz

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
      this.usuarios.forEach(usuario => {
        if (usuario.idPersona) {
          this.personaService.getbyId(usuario.idPersona).subscribe(persona => {
            usuario.nombrePersona = persona.nombre; // Suponiendo que el campo en la API es "nombre"
            usuario.apellidoPaterno=persona.apellidoPaterno;
            usuario.apellidoMaterno=persona.apellidoMaterno;
          });
        }
      });
    });
  }
  openCreateModal() {
    this.usuario = {};
    this.mostrarModalUsuario = true;
  }

  closeCreateModal() {
    this.mostrarModalUsuario = false;
  }

  
  openEditModal(usuario: any) {
    this.usuario = { ...usuario }; // ✅ Ahora usa directamente el usuario pasado
    this.mostrarModalUsuario = true;
  }

  cambiarEstado(id: number, estadoActual: boolean) {
    this.usuarioService.cambiarEstadoUsuario(id, estadoActual).subscribe({
      next: (response) => {
        console.log("Estado cambiado:", response);
        this.obtenerUsuarios(); // Recargar la lista de usuarios
      },
      error: (err) => {
        console.error("Error al cambiar el estado:", err);
      }
    });
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
          this.usuarioService.delete(id).subscribe({
            next: () => {
              Swal.fire(
                '¡Eliminado!',
                'El Usuario a sido Eliminado',
                'success'
              );
              this.obtenerUsuarios();
            },
            error: (error) => {
              console.error("Error al eliminar:", error);
              Swal.fire(
                'Error',
                'No se pudo eliminar al usuario.',
                'error'
              );
            }
          });
        }
      });
    }
}
