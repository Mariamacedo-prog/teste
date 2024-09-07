import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ValidateService } from '../../../services/utils/validate.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { AcessoService } from '../../../services/acesso.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {
  constructor(private toolboxService: ToolboxService, 
    private router: Router,
    private route: ActivatedRoute,
    private validateService: ValidateService,
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder, 
    private acessoService: AcessoService,
    private  authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.acesso;
      });
      this.authService.isLoggedIn$.subscribe(logged => {
        this.isLoggedIn = logged;
      });
    }
  userId = '';
  access: any = '';
  view: boolean = false;
  isLoggedIn: boolean = false;
  confirmSenha: string = '';
  databaseInfo: any = {};
  timeoutId: any;
  acessos: any[] = [];
  filteredAcessos: any[] = [];
  loadingAcessos: boolean = false;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nomeFormControl = new FormControl('', Validators.required);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);
  loginCpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPForCNPJ]);
  senhaFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]);
  confirmSenhaFormControl = new FormControl('', [Validators.required, this.comparePasswords.bind(this)]);
  createdAtFormControl = new FormControl(null);
  deletedAtFormControl = new FormControl(null);
  updatedAtFormControl = new FormControl(null);
  perfil = this.formBuilder.group({
    id: [''],
    nomeGrupo: ['']
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.userId = params['id'];
       
       if(params['tela'] == 'visualizar'){
        this.view = true;
       }
    });

    this.isAuthenticated();
    this.findAcessos();
    if(this.userId){
      this.usuariosService.findById(this.userId).subscribe(user => {
        this.emailFormControl.setValue(user.email);
        this.nomeFormControl.setValue(user.nome);
        this.telefoneFormControl.setValue(user.telefone);
        this.loginCpfFormControl.setValue(user.cpf.replace(/\D/g, ''));
        this.senhaFormControl.setValue(user.senha);
        this.confirmSenhaFormControl.setValue(user.senha);
        if(user.perfil){
          this.perfil?.get('id')?.setValue(user.perfil.id);
          this.perfil?.get('nomeGrupo')?.setValue(user.perfil.nomeGrupo);
        }

        if(user.createdAt){
          this.createdAtFormControl?.setValue(user.createdAt);
        }

        if(user.deletedAt){
          this.deletedAtFormControl?.setValue(user.deletedAt);
        }

        if(user.updatedAt){
          this.updatedAtFormControl?.setValue(user.updatedAt);
        }
        
        this.maskCpfCnpj();
      });
    }
  }

  findAcessos(){
    this.acessoService.getItems().subscribe((acessos)=>{
      this.acessos = acessos;
    });
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
    const cpf = this.loginCpfFormControl?.value || '';
    const item = {
      "email":this.emailFormControl.value,
      "senha": this.senhaFormControl.value,
      "nome": this.nomeFormControl.value,
      "telefone": this.telefoneFormControl.value,
      "cpf": cpf.replace(/\D/g, ''),
      "perfil": this.perfil.getRawValue(),
      "createdAt": new Date(),
      "deletedAt": null,
      "updatedAt": new Date(),
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
    const cpf = this.loginCpfFormControl?.value || '';
    if(this.confirmSenhaFormControl.value != this.senhaFormControl.value){
      this.toolboxService.showTooltip('error', 'Senhas divergentes!', 'ERRO!');
    }

    const item = {
      "email":this.emailFormControl.value,
      "senha": this.senhaFormControl.value,
      "nome": this.nomeFormControl.value,
      "telefone": this.telefoneFormControl.value,
      "cpf": cpf.replace(/\D/g, ''),
      "perfil": this.perfil.getRawValue(),
      "createdAt": this.createdAtFormControl.value,
      "deletedAt": this.deletedAtFormControl.value,
      "updatedAt": new Date(),
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

  cpfCnpjLength() {
    const value = this.loginCpfFormControl?.value || '';
    return value.replace(/\D/g, '').length;
  }

  maskCpfCnpj(){
    const value = this.loginCpfFormControl?.value || '';
    this.loginCpfFormControl?.setValue(this.validateService.formatCpfCnpj(value))
  }

  handleKeyUpAcesso(event: any) {
    this.loadingAcessos = true;
    clearTimeout(this.timeoutId); 
    const nome = event.target.value.trim();
    if (nome.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.searchAcesso(nome);
      }, 2000); 
    } else {
      this.filteredAcessos = [];
      this.loadingAcessos = false;
    }
  }

  searchAcesso(nome: string) {
    this.filteredAcessos = []
    this.acessos.filter((item: any) => {
      if(item.nomeGrupo?.toLowerCase().includes(nome.toLowerCase())){
         this.filteredAcessos.push(item);
      }  
    });
    this.loadingAcessos = false;
  }

  selectAcesso(item: any){
    this.perfil?.get('id')?.setValue(item.id);
    this.perfil?.get('nomeGrupo')?.setValue(item.nomeGrupo);
    this.loadingAcessos = false;
  }
}
