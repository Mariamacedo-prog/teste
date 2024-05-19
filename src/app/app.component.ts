import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn: boolean = true;
  title = 'reurb';
  isMenuOpen: boolean = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  onMenuToggled(isMenuOpen: any) {
    this.isMenuOpen = isMenuOpen;
  }
}
