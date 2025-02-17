import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../../services/utils/cep.service';
import { ValidateService } from '../../../services/utils/validate.service';
import { PrefeiturasService } from '../../../services/prefeituras.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-prefeitura-form',
  templateUrl: './prefeitura-form.component.html',
  styleUrl: './prefeitura-form.component.css'
})
export class PrefeituraFormComponent {
  access: any = '';
  prefeituraId = "";
  databaseInfo: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  formControls!: FormGroup;
  showAnexos: boolean  = false;
  user: any = {};

  constructor(private toolboxService: ToolboxService, private router: Router,
    private route: ActivatedRoute, private cepService: CepService, private formBuilder: FormBuilder,
    private validateService: ValidateService, private prefeiturasService: PrefeiturasService,
    private  authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.prefeitura;
      });
      
      this.authService.user$.subscribe(user => {
        this.user = user;
      });
    }


  responsavelFormControls = this.formBuilder.group({
    nome: [''],
    cargo: ['']
  });

  enderecoFormControls = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required],
    cep: ['', Validators.required]
  });

  representanteFormControls = this.formBuilder.group({
    nome: [''],
    nacionalidade: [''],
    cpf: [''],
    rg: [''],
  });

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }
    
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      responsavel: this.responsavelFormControls,
      representante: this.representanteFormControls,
      endereco: this.enderecoFormControls,
      nome: ['', Validators.required],
      empresaId: [''],
      cnpj: ['', [Validators.required, this.validateService.validateCNPJ]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      anexos: this.formBuilder.group({
        logoFile: {base64: '',type: ''}
      }),
    });

    this.route.params.subscribe(params => {
      this.prefeituraId = params['id'];

      if(params['tela'] == 'visualizar'){
       this.visualizar = true;
      }
   });

   if(this.prefeituraId){
     this.prefeiturasService.findById(this.prefeituraId).subscribe(prefeitura => {
      this.formControls.get('nome')?.setValue(prefeitura.nome);
      this.formControls.get('cnpj')?.setValue(prefeitura.cnpj);
      this.formControls.get('telefone')?.setValue(prefeitura.telefone);
      this.formControls.get('email')?.setValue(prefeitura.email);
      if(prefeitura.empresaId){
        this.formControls.get('empresaId')?.setValue(prefeitura.empresaId);
      }

      this.formControls.get('representante')?.get('nome')?.setValue(prefeitura.representante.nome);
      this.formControls.get('representante')?.get('nacionalidade')?.setValue(prefeitura.representante.nacionalidade);
      this.formControls.get('representante')?.get('cpf')?.setValue(prefeitura.representante.cpf);
      this.formControls.get('representante')?.get('rg')?.setValue(prefeitura.representante.rg);

      this.formControls.get('responsavel')?.get('nome')?.setValue(prefeitura.responsavel.nome);
      this.formControls.get('responsavel')?.get('cargo')?.setValue(prefeitura.responsavel.cargo);

      this.formControls.get('endereco')?.get('rua')?.setValue(prefeitura.endereco.rua);
      this.formControls.get('endereco')?.get('cep')?.setValue(prefeitura.endereco.cep);
      this.formControls.get('endereco')?.get('bairro')?.setValue(prefeitura.endereco.bairro);
      this.formControls.get('endereco')?.get('cidadeUf')?.setValue(prefeitura.endereco.cidadeUf);
      this.formControls.get('endereco')?.get('complemento')?.setValue(prefeitura.endereco.complemento);
      this.formControls.get('endereco')?.get('numero')?.setValue(prefeitura.endereco.numero);

  
      if(prefeitura?.anexos){
        this.formControls?.get('anexos')?.get('logoFile')?.patchValue(prefeitura.anexos.logoFile);
      }

      this.showAnexos = true

     });
    }else{
      this.showAnexos = true;
    }
  }

  create() {
    if(this.formControls.get('cnpj')?.getRawValue()){
      this.prefeiturasService.checkIfcnpjExists(this.formControls.get('cnpj')?.getRawValue()).toPromise().then(cpfExists => {
        if (!cpfExists) {
          
          let item = this.formControls.getRawValue()
          if(this.user.empresaId){
            item.empresaId = this.user.empresaId;
          }

          this.prefeiturasService.save(item);
          this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');

          this.router.navigate(['/prefeitura/lista']);
          return Promise.resolve();
        } else {
            this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
            return Promise.resolve();
        }
      });
    }
  }

  update(){
    if(this.formControls.get('cnpj')?.getRawValue()){
      this.prefeiturasService.updateItem(this.prefeituraId, this.formControls.getRawValue())
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
    }
  }

  saveFileBase64(event: { base64: string, type: string }) {
    this.formControls?.get("anexos")?.get("logoFile")?.patchValue(event)
  }

  formatPhone() {
    if(this.formControls.get('telefone')?.value){
      let telefone = this.formControls.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.formControls.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  findAddress() {
    this.formControls.get('endereco')?.get('cep')?.value;
    if(  this.formControls.get('endereco')?.get('cep')?.value){
      this.clearAddress();
      if (  this.formControls.get('endereco')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('endereco')?.get('cep')?.value)
          .subscribe(
            data => {
              if(!data.erro){
                this.formControls.get('endereco')?.get('rua')?.setValue(data.logradouro);
                this.formControls.get('endereco')?.get('bairro')?.setValue(data.bairro);
                this.formControls.get('endereco')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.clearAddress();
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  clearAddress(){
    this.formControls.get('endereco')?.get('rua')?.setValue("");
    this.formControls.get('endereco')?.get('bairro')?.setValue("");
    this.formControls.get('endereco')?.get('cidadeUf')?.setValue("")
  }

  formValid(): boolean {
    return this.formControls.valid;
  }
}
