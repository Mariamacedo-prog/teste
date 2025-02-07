import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolboxService } from '../../components/toolbox/toolbox.service';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = {
    cpf: '',
    senha: ''
  };
  empresaSelected: any = {};
  paramItem: any = ''
  title = "REURB"

  empresasList: any = [];

  contratante = {
    cpf: ''
  };


  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private toolboxService: ToolboxService, private empresaService: EmpresasService) {}
  ngOnInit(): void {
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.router.navigate(['/usuario/lista']);
    }

    this.route.queryParamMap.subscribe(params => {
      const franqueado = params.get('franqueado');
      if(franqueado){
        this.paramItem = franqueado;
      }else{
        this.paramItem =  "REURB";
      }
    });

    this.empresaService.getItems().subscribe((empresas)=>{
      if (empresas.length >= 0) {
        this.empresasList = empresas;

        let indexEmpresa = empresas.findIndex((item: any) => item.companyIdentifier === this.paramItem);

        if(indexEmpresa >= 0){
          this.empresaSelected = empresas[indexEmpresa]
        }
      }
    });
  }

  login(): void {
    this.authService.login(this.usuario.cpf, this.usuario.senha, this.empresaSelected?.id).subscribe(() => {
      if (this.authService.isLoggedIn$) {
        const redirectUrl = this.authService.redirectUrl
          ? this.authService.redirectUrl
          : '/usuario/lista';
        this.router.navigate([redirectUrl]);
      }else{
        this.toolboxService.showTooltip('error', 'Usuário ou senha incorreta!', 'ERRO!');
      }
    });
  }

  loginContratante(): void {
    this.authService.loginContratante(this.contratante.cpf, this.empresaSelected?.id).subscribe(() => {
      if (this.authService.isLoggedIn$) {
        const redirectUrl = this.authService.redirectUrl
          ? this.authService.redirectUrl
          : '/gerenciarDocumento/lista';
        this.router.navigate([redirectUrl]);
      }else{
        this.toolboxService.showTooltip('error', 'Usuário ou senha incorreta!', 'ERRO!');
      }
    });
  }

  changeEmpresa(event: any): void {
    if(event.value){
      this.empresaSelected = event.value;
      this.updateFranqueado(event.value.companyIdentifier)
    }
  }

  updateFranqueado(novoValor: string): void {
    const queryParams = { ...this.route.snapshot.queryParams };

    queryParams['franqueado'] = novoValor;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
