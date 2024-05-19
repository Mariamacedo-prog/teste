import { AuthService } from './../../auth/auth.service';
import {Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuService } from '../../services/menu.service';
interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() menuToggled = new EventEmitter<boolean>();
  menuItens: MenuItem[] = [];
  isMenuOpen = false;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef,private menuService: MenuService, private media: MediaMatcher, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 1200px)');
    this._mobileQueryListener = () => {
      this.isMenuOpen = !this.mobileQuery.matches;
      this.changeDetectorRef.detectChanges();
      
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.menuItens=this.menuService.getMenuItems();
  }

  isAuthenticated(): boolean | null{
    if(localStorage.getItem('isLoggedIn') == 'true'){
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  logout(){
    this.authService.logout()
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggled.emit(this.isMenuOpen);
  }
}
