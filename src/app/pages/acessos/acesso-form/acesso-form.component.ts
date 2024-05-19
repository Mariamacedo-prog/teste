import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/utils/validate.service';
import { MatChipListbox, MatChipListboxChange, MatChipOption } from '@angular/material/chips';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-acesso-form',
  templateUrl: './acesso-form.component.html',
  styleUrl: './acesso-form.component.css'
})
export class AcessoFormComponent {
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  filteredOptions: Observable<string[]> = of([]);
  formControls!: FormGroup;
  telasPermitidas: { tela: string; nivel: any; }[] = [];
  arrayTelas: any = [];


  timeoutId: any;
  filteredCpf: any[] = [];
  loadingCpf: boolean = false;
  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private formBuilder: FormBuilder,
    private validateService: ValidateService
    ) {}

  usuarioFormControls = this.formBuilder.group({
    id: [0, Validators.required],
    email:  ['', [Validators.required, Validators.email]],
    nome: ['', Validators.required],
    cpf: ['', [Validators.required, this.validateService.validateCPF]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
    telas: [[[]], [Validators.required]]
  });

  grupoFormControls = this.formBuilder.group({
    id: [0, Validators.required],
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    telas: [[[]], Validators.required]
  });


  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      usuario: this.usuarioFormControls,
      grupo: this.grupoFormControls
    });
    this.isAuthenticated();

    const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        this.databaseInfo = JSON.parse(storedDb);
        this.arrayTelas = this.databaseInfo.telas;
      }
  }

  localizaUsuario(){
    const usuario = this.databaseInfo.usuarios.find((item: any) => item.cpf == this.formControls.get('usuario')?.get('cpf')?.value);
    if(usuario){
      this.formControls.get('usuario')?.get('nome')?.setValue(usuario.nome);
      this.formControls.get('usuario')?.get('telefone')?.setValue(usuario.telefone);
      this.formControls.get('usuario')?.get('email')?.setValue(usuario.email);
      this.formControls.get('usuario')?.get('id')?.setValue(usuario.id);

      this.formControls.get('id')?.setValue(Math.floor(Math.random() * 100000));
    }else{
      this.toolboxService.showTooltip('error', 'Usuário não encontrado na base de dados!', 'ERRO CPF!');
    }
  }

  cadastrar() {
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    if(this.databaseInfo.acessos){
      const acessosPeloCnpj = this.databaseInfo.acessos.find((item: any) => item.usuario.cpf == this.formControls.get('usuario')?.get('cpf')?.value);
      if(acessosPeloCnpj){
        this.toolboxService.showTooltip('error', 'Usuário com CPF com permissao já cadastrada na base de dados!', 'ERRO CPF!');
        return;
      }
    }
    
    this.databaseInfo.acessos.push(
      this.formControls.getRawValue()
    )

    localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));
    this.toolboxService.showTooltip('success', 'Cadastro de Permissão realizada com sucesso!', 'Sucesso!');
    this.router.navigate(['/acesso/lista']);
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }
  }

  formatarTelefone() {
    if(this.formControls.get('prefeitura')?.get('telefone')?.value){
      let telefone = this.formControls.get('prefeitura')?.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls.get('prefeitura')?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.formControls.get('prefeitura')?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  formularioValido(): boolean {
    return this.formControls.valid;
  }

  permissaoTela(tela: string, event: MatChipListboxChange) {
    if (event.value !== 'Restrito' && event.value != undefined) {
      const index = this.telasPermitidas.findIndex((item: any) => item.tela === tela);
  
      if (index !== -1) {
        this.telasPermitidas[index] = {
          tela: tela,
          nivel: event.value
        };
      } else {
        this.telasPermitidas.push({
          tela: tela,
          nivel: event.value
        });
      }
    } else {
      const index = this.telasPermitidas.findIndex((item: any) => item.tela === tela);
      if (index !== -1) {
        this.telasPermitidas.splice(index, 1);
      }
    }

    this.formControls.get('usuario')?.get('telas')?.setValue(this.telasPermitidas);
    this.formControls.get('grupo')?.get('telas')?.setValue(this.telasPermitidas);
  }

  onSelectGrupo(event: any){
    const selectedGroup = event.value;
 
    this.formControls.get('grupo')?.get('nome')?.setValue(selectedGroup.nome);
    this.formControls.get('grupo')?.get('descricao')?.setValue("teste");
    this.formControls.get('grupo')?.get('id')?.setValue(selectedGroup.id);

    console.log('Selected Group:', this.formControls.getRawValue(),  this.formControls);
  }

  handleKeyUp(event: any){
    this.loadingCpf = true;
    clearTimeout(this.timeoutId); 
    const nome = event.target.value.trim();
    if (nome.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.buscarCpf(nome);
      }, 2000); 
    } else {

      this.filteredCpf = [];
    }
  }

  buscarCpf(cpf: string) {
    this.filteredCpf = this.databaseInfo.usuarios.filter((item: any) => {
      return item.cpf?.includes(cpf);
    });
    this.loadingCpf = false;
  }

  selectedCpf(option: any){
    this.loadingCpf = false;
    if(option){
      if(option.nome){
        this.formControls.get('usuario')?.get('nome')?.setValue(option.nome);
      }
      if(option.cpf){
        this.formControls.get('usuario')?.get('cpf')?.setValue(option.cpf);
      }
    }
  }
}
