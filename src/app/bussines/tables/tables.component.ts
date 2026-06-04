import { Component, OnInit } from '@angular/core';
import { SubCategoriaService } from '../../service/subcategoria.service';
import { Categoria, SubCategoria } from '../../models/subcategoria';
import { CategoriaService } from '../../service/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent  {

  activeTab: string = 'libros'; // Controla qué pestaña mostrar en el HTML

 
}

