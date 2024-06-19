import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { CepService } from '../../../services/utils/cep.service';
import { ValidateService } from '../../../services/utils/validate.service';
import { FuncionariosService } from '../../../services/funcionarios.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-funcionario-form',
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})
export class FuncionarioFormComponent {

  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private validateService: ValidateService,
    private funcionariosService: FuncionariosService, private usuariosService: UsuariosService) {}
  funcionarioId = '';
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  options: string[] = [];

  visualizar: boolean = false;

  filteredOptions: any[] = [];
  timeoutId: any;
  usuarios: any[] = [];
  loadingUsuario: boolean = false;

  nomeFormControl = new FormControl('', Validators.required);
  cpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPForCNPJ]);
  ruaFormControl = new FormControl('', [Validators.required]);
  numeroFormControl = new FormControl('', [Validators.required]);
  bairroFormControl = new FormControl('', [Validators.required]);
  complementoFormControl = new FormControl('');
  cidadeUfFormControl = new FormControl('', [Validators.required]);
  usuarioFormControl = new FormControl('', [Validators.required]);
  cepFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);


  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.funcionarioId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    if(this.funcionarioId){
      this.funcionariosService.findById(this.funcionarioId).subscribe(funcionario => {
        this.nomeFormControl.setValue(funcionario.nome);
        this.cpfFormControl.setValue(funcionario.cpf);
        this.emailFormControl.setValue(funcionario.email);
        this.telefoneFormControl.setValue(funcionario.telefone);
        this.usuarioFormControl.setValue(funcionario.usuario);
        this.ruaFormControl.setValue(funcionario.rua);
        this.numeroFormControl.setValue(funcionario.numero);
        this.bairroFormControl.setValue(funcionario.bairro);
        this.complementoFormControl.setValue(funcionario.complemento);
        this.cidadeUfFormControl.setValue(funcionario.cidadeUf);
        this.cepFormControl.setValue(funcionario.cep);
      });
    }
    this.usuariosService.getItems().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  findUsuario(nome: string) {
    if (this.usuarioFormControl.value) {
      this.filteredOptions = this.usuarios.filter((item: any) => {
        return item.nome.toLowerCase().includes(nome.toLowerCase());
      });
     
    }
    this.loadingUsuario = false;
  }

  handleKeyUp(event: any){
    this.loadingUsuario = true;
    clearTimeout(this.timeoutId); 
    let nome = event.target.value.trim();
    if (nome.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.findUsuario(nome);
      }, 2000); 
    } else {
      
    }
  }

  create() {
    const item =  {
      "nome":this.nomeFormControl.value,
      "cpf":this.cpfFormControl.value,
      "rua": this.ruaFormControl.value,
      "numero": this.numeroFormControl.value,
      "bairro": this.bairroFormControl.value,
      "complemento": this.complementoFormControl.value,
      "cidadeUf": this.cidadeUfFormControl.value,
      "usuario":this.usuarioFormControl.value,
      "email": this.emailFormControl.value,
      "telefone":this.telefoneFormControl.value,
      "cep": this.cepFormControl.value
    }

    if(item.cpf){
      this.funcionariosService.checkIfCPFExists(item.cpf).toPromise().then(cpfExists => {
        if (!cpfExists) {
          this.funcionariosService.save(item);
          this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
  
          this.router.navigate(['/funcionario/lista']);
          return Promise.resolve();
        } else {
            this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
            return Promise.resolve();
        }
      });
    }
  }

  update(){
    const item =  {
      "nome":this.nomeFormControl.value,
      "cpf":this.cpfFormControl.value,
      "rua": this.ruaFormControl.value,
      "numero": this.numeroFormControl.value,
      "bairro": this.bairroFormControl.value,
      "complemento": this.complementoFormControl.value,
      "cidadeUf": this.cidadeUfFormControl.value,
      "usuario":this.usuarioFormControl.value,
      "email": this.emailFormControl.value,
      "telefone":this.telefoneFormControl.value,
      "cep": this.cepFormControl.value
    }

    if(item.cpf){
      this.funcionariosService.updateItem(this.funcionarioId, item)
    }
  }

  formValid(): boolean {
    return (
        this.nomeFormControl.valid &&
        this.cpfFormControl.valid &&
        this.ruaFormControl.valid &&
        this.numeroFormControl.valid &&
        this.bairroFormControl.valid &&
        this.cidadeUfFormControl.valid &&
        this.usuarioFormControl.valid &&
        this.emailFormControl.valid &&
        this.telefoneFormControl.valid
    );
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
  }

  formatPhone() {
    if(this.telefoneFormControl.value){
      let telefone = this.telefoneFormControl.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.telefoneFormControl.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.telefoneFormControl.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  findAddress() {
    if(this.cepFormControl.value){
      this.cleanAddress();

      if (this.cepFormControl.value.toString().length === 8) {
        this.cepService.getAddressByCep(this.cepFormControl.value)
          .subscribe(
            data => {
              if(!data.erro){
                this.ruaFormControl.setValue(data.logradouro);
                this.bairroFormControl.setValue(data.bairro);
                this.cidadeUfFormControl.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.cleanAddress();
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  cleanAddress(){
    this.ruaFormControl.setValue('');
    this.bairroFormControl.setValue('');
    this.cidadeUfFormControl.setValue('');
  }
}
