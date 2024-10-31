import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent  implements OnInit{
  sidebar: HTMLElement | null = null;
  maxSidebar: HTMLElement | null = null;
  miniSidebar: HTMLElement | null = null;
  roundout: HTMLElement | null = null;
  maxToolbar: HTMLElement | null = null;
  logo: HTMLElement | null = null;
  content: HTMLElement | null = null;
  moon: HTMLElement | null = null;
  sun: HTMLElement | null = null;

  ngOnInit(): void {
    // Inicializamos las referencias a los elementos del DOM al montar el componente
    this.sidebar = document.querySelector('aside');
    this.maxSidebar = document.querySelector('.max');
    this.miniSidebar = document.querySelector('.mini');
    this.roundout = document.querySelector('.roundout');
    this.maxToolbar = document.querySelector('.max-toolbar');
    this.logo = document.querySelector('.logo');
    this.content = document.querySelector('.content');
    this.moon = document.querySelector('.moon');
    this.sun = document.querySelector('.sun');
  }

  setDark(mode: 'dark' | 'light'): void {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      this.moon?.classList.add('hidden');
      this.sun?.classList.remove('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      this.sun?.classList.add('hidden');
      this.moon?.classList.remove('hidden');
    }
    
    
  }

   openNav(): void {
    if (this.sidebar?.classList.contains('-translate-x-48')) {
      // Max sidebar
      this.sidebar.classList.remove('-translate-x-48');
      this.sidebar.classList.add('translate-x-none');
      this.maxSidebar?.classList.remove('hidden');
      this.maxSidebar?.classList.add('flex');
      this.miniSidebar?.classList.remove('flex');
      this.miniSidebar?.classList.add('hidden');
      this.maxToolbar?.classList.add('translate-x-0');
      this.maxToolbar?.classList.remove('translate-x-24', 'scale-x-0');
      this.logo?.classList.remove('ml-12');
      this.content?.classList.remove('ml-12');
      this.content?.classList.add('ml-12', 'md:ml-60');
    } else {
      // Mini sidebar
      this.sidebar?.classList.add('-translate-x-48');
      this.sidebar?.classList.remove('translate-x-none');
      this.maxSidebar?.classList.add('hidden');
      this.maxSidebar?.classList.remove('flex');
      this.miniSidebar?.classList.add('flex');
      this.miniSidebar?.classList.remove('hidden');
      this.maxToolbar?.classList.add('translate-x-24', 'scale-x-0');
      this.maxToolbar?.classList.remove('translate-x-0');
      this.logo?.classList.add('ml-12');
      this.content?.classList.remove('ml-12', 'md:ml-60');
      this.content?.classList.add('ml-12');
    }
  }
}
