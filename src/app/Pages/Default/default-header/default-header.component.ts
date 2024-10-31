import { Component } from '@angular/core';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.scss'
})
export class DefaultHeaderComponent {
  title: string = 'Mi Aplicación';

  onButtonClick() {
    console.log('Botón presionado en el header');
    // Aquí puedes incluir la lógica que desees ejecutar al hacer clic
  }
}
