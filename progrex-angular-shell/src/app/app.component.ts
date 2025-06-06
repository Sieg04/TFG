import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  standalone: true, // Explicitly mark as standalone
  imports: [
    CommonModule, // Add CommonModule
    RouterOutlet,
    HeaderComponent, // Add HeaderComponent
    SidebarComponent  // Add SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' // styleUrl is fine for standalone
})
export class AppComponent {
  title = 'progrex-angular-shell';

  constructor(public authService: AuthService) {} // Inject AuthService and make it public
}
