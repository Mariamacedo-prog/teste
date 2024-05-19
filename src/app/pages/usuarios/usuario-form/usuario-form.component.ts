import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ValidateService } from '../../../services/utils/validate.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {

  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
    private validateService: ValidateService, private usuariosService: UsuariosService) {}

  userId = '';
  view: boolean = false;
  isLoggedIn: boolean = false;
  confirmSenha: string = '';
  databaseInfo: any = {};

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nomeFormControl = new FormControl('', Validators.required);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);
  loginCpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPF]);
  senhaFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]);
  confirmSenhaFormControl = new FormControl('', [Validators.required, this.comparePasswords.bind(this)]);



  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.userId = params['id'];
       
       if(params['tela'] == 'visualizar'){
        this.view = true;
       }
    });

    this.isAuthenticated();

    if(this.userId){
      this.usuariosService.findById(this.userId).subscribe(user => {
        this.emailFormControl.setValue(user.email);
        this.nomeFormControl.setValue(user.nome);
        this.telefoneFormControl.setValue(user.telefone);
        this.loginCpfFormControl.setValue(user.cpf);
        this.senhaFormControl.setValue(user.senha);
        this.confirmSenhaFormControl.setValue(user.senha);
      });
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

  comparePasswords(control: FormControl): { [key: string]: any } | null {
    const confirmSenha = control.value;
    const password = this.senhaFormControl.value;

    if (password && confirmSenha && password !== confirmSenha) {
      return { 'senhasDivergentes': true };
    }

    return null;
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
  }



  create() {
    const item = {
      "email":this.emailFormControl.value,
      "senha": this.senhaFormControl.value,
      "nome": this.nomeFormControl.value,
      "telefone": this.telefoneFormControl.value,
      "cpf":this.loginCpfFormControl.value
    }

    if(this.confirmSenhaFormControl.value != this.senhaFormControl.value){
       this.toolboxService.showTooltip('error', 'Senhas divergentes!', 'ERRO!');
    }
    if(item.cpf){
      this.usuariosService.checkIfCPFExists(item.cpf).toPromise().then(cpfExists => {
        if (!cpfExists) {
          this.usuariosService.saveUser(item);
          this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
          if(this.isLoggedIn){
            this.router.navigate(['/usuario/lista']);
          }else{
            this.router.navigate(['/login']);       
          }
          return Promise.resolve();
        } else {
            this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
            return Promise.resolve();
        }
      });
    }
  }

  async update(){
    if(this.confirmSenhaFormControl.value != this.senhaFormControl.value){
      this.toolboxService.showTooltip('error', 'Senhas divergentes!', 'ERRO!');
    }

    const item = {
      "email":this.emailFormControl.value,
      "senha": this.senhaFormControl.value,
      "nome": this.nomeFormControl.value,
      "telefone": this.telefoneFormControl.value,
      "cpf":this.loginCpfFormControl.value
    }

    if(item.cpf){
      this.usuariosService.updateItem(this.userId, item)

    }
  }

  validForm(): boolean {
    return (
        this.nomeFormControl.valid &&
        this.emailFormControl.valid &&
        this.telefoneFormControl.valid &&
        this.loginCpfFormControl.valid &&
        this.senhaFormControl.valid &&
        this.confirmSenhaFormControl.valid
    );
  }
}
