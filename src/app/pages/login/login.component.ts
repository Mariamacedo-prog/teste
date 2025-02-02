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
  empresaId = '';
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
        console.log('Valor de teste (dinâmico):', franqueado);
      }else{
        this.paramItem =  "REURB";
      }
    });

    this.empresaService.getItems().subscribe((empresas)=>{
      if (empresas.length >= 0) {
        this.empresasList = empresas;

        let indexEmpresa = empresas.findIndex((item: any) => item.companyIdentifier === this.paramItem);

        if(indexEmpresa >= 0){
          this.empresaId = empresas[indexEmpresa].id
        }
      }
    });
  }

  login(): void {
    this.authService.login(this.usuario.cpf, this.usuario.senha).subscribe(() => {
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
    this.authService.loginContratante(this.contratante.cpf).subscribe(() => {
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
    console.log(event)
  }
}
