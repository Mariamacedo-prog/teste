import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { UsuariosService } from '../services/usuarios.service';
import { AuthState, loginSuccess, setPermissions, logOutSuccess }  from "../store/store"
import { Store } from '@ngrx/store';
import { AcessoService } from '../services/acesso.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string | null = null;

  permissions$: Observable<any>;
  user$: Observable<any>;
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, 
    private usuariosService: UsuariosService,
    private acessoService: AcessoService,
    private store: Store<{ auth: AuthState }>
  ) {
    this.permissions$ = this.store.select(state => state.auth.permissions);
    this.user$ = this.store.select(state => state.auth.user);
    this.isLoggedIn$ = this.store.select(state => state.auth.isLoggedIn);
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
          this.store.dispatch(loginSuccess({ user: usuarioEncontrado[0] }));
          if(usuarioEncontrado[0].perfil.id){
            this.getAllPermissions(usuarioEncontrado[0].perfil.id);
          }else{
            this.store.dispatch(setPermissions({ permissions: {
              acesso: 'restrito',
              cartorio: 'restrito',
              contratante: 'restrito',
              contrato: 'restrito',
              funcionario: 'restrito',
              imovel: 'restrito',
              nucleo: 'restrito',
              plano: 'restrito',
              prefeitura: 'restrito',
              status: 'restrito',
              usuario: 'restrito',
              vendedor: 'restrito',
            } }));
          }
        }
      });
    }
    return of(this.isLoggedIn).pipe(delay(1000));
  }

  logout(): void {
    this.isLoggedIn = false;
    this.store.dispatch(logOutSuccess());
    this.router.navigate(['/login']);
  }

  getAllPermissions(id: any): void {
    this.acessoService.findById(id).subscribe(item => {
      if(item.permissoes){
        this.store.dispatch(setPermissions({ permissions: item.permissoes }));
      }
    })
  }
}