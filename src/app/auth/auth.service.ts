import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { UsuariosService } from '../services/usuarios.service';
import { AuthState, loginSuccess, setPermissions, logOutSuccess }  from "../store/store"
import { Store } from '@ngrx/store';
import { AcessoService } from '../services/acesso.service';
import { ContratantesService } from '../services/contratantes.service';
import { ToolboxService } from '../components/toolbox/toolbox.service';
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
    private toolboxService: ToolboxService,
    private usuariosService: UsuariosService,
    private contratantesService: ContratantesService,
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

  login(cpf: string, senha: string, empresaId: string): Observable<boolean> {
    if (cpf && senha) {
      this.usuariosService.findByCpfSenha(cpf, senha, empresaId).subscribe(usuarioEncontrado => {
        if (usuarioEncontrado.length > 0) {
          this.store.dispatch(loginSuccess({ user: usuarioEncontrado[0]}));           
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
              gerenciar_documento: 'restrito',
              empresas: 'restrito'
            } }));
          }
        }else{
          this.toolboxService.showTooltip('error',"CPF/CNPJ, senha ou empresa incorretos. Verifique os dados e tente novamente.", 'ERROR!');
        }
      });
    }
    return of(this.isLoggedIn).pipe(delay(1000));
  }

  loginContratante(cpf: string, empresaId: string): Observable<boolean> {
    if (cpf) {
      this.contratantesService.findByCpf(cpf, empresaId).subscribe(usuarioEncontrado => {
        if (usuarioEncontrado.length > 0) {
          this.store.dispatch(loginSuccess({ user: usuarioEncontrado[0] }));
      
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
              gerenciar_documento: 'consulta',
              empresas: 'restrito'
            } }));
        
        }else{
          this.toolboxService.showTooltip('error',"CPF/CNPJ ou Empresa inválidos. Por favor, verifique os dados e tente novamente.", 'ERROR!');
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