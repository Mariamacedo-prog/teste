import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string | null = null;
  private db: any = {usuarios: [], acessos: [],funcionarios: [], contratante: [], menu:[]};
  public usuarioLogado: any;

  constructor(private router: Router, private usuariosService: UsuariosService) {
  }

  ngOnDestroy(): void {
    this.logout();
  }

  isUserLoggedIn(): boolean{
    return this.isLoggedIn;
  }

  login(cpf: string, senha: string): Observable<boolean> {
    if (cpf && senha) {
      this.usuariosService.findByCpfSenha(cpf, senha).subscribe(usuarioEncontrado => {
        if (usuarioEncontrado.length > 0) {
          this.isLoggedIn = true;
          localStorage.setItem('isLoggedIn', JSON.stringify(true));
          localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado[0]));
        }
      });
    }
    return of(this.isLoggedIn).pipe(delay(1000));
  }

  logout(): void {
    this.isLoggedIn = false;
    this.usuarioLogado = null;
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    localStorage.setItem('usuario', JSON.stringify(null));

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}