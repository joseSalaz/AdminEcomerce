import { Component, EventEmitter, Output } from '@angular/core';
import { Persona } from '../../../models/persona';
import { PersonaService } from '../../../service/persona.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.scss'
})
export class PersonaComponent {
  
  nuevaPersona: Persona = {
    idPersona: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    tipoDocumento: 'DNI', // Valor por defecto
    numeroDocumento: '',
    telefono: ''
  };

  listaPersonas: Persona[] = [];
  @Output() personaCreada = new EventEmitter<Persona>();
  @Output() cerrar = new EventEmitter<void>();

  constructor(private personaService: PersonaService) {}

  guardarPersona() {
    console.log('Datos antes de enviar:', this.nuevaPersona); // Verifica que tiene valores
  
    this.personaService.crearPersona(this.nuevaPersona).subscribe({
      next: (personaCreada: Persona) => {
        console.log('Persona creada:', personaCreada); // Verifica la respuesta del backend
        this.listaPersonas.push(personaCreada);
        this.personaCreada.emit(personaCreada);
        this.cerrar.emit();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al crear la persona:', err);
      }
    });
  }
  

  cerrarModal() {
    this.cerrar.emit();
  }

  resetForm() {
    this.nuevaPersona = {
      idPersona: 0,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      correo: '',
      tipoDocumento: '',
      numeroDocumento: '',
      telefono: ''
    };
  }
}
