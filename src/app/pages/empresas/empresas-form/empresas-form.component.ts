import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/utils/validate.service';
import { AuthService } from '../../../auth/auth.service';
import { EmpresasService } from '../../../services/empresas.service';
import { CepService } from '../../../services/utils/cep.service';
import { AcessoService } from '../../../services/acesso.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-empresas-form',
  templateUrl: './empresas-form.component.html',
  styleUrl: './empresas-form.component.css'
})
export class EmpresasFormComponent {
  empresaId = "";
  userId = "";
  access: any = '';
  empresasList: any = [];
  databaseInfo: any = {};
  visualizar: boolean = false;
  formControls!: FormGroup;
  timeoutId: any;
  
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute, 
    private validateService: ValidateService, private formBuilder: FormBuilder, private empresaService: EmpresasService, 
    private cepService: CepService, private authService: AuthService, private acessoService:  AcessoService, private usuarioService:  UsuariosService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.empresas;
      });
    }
  enderecoFormControl = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cep: [''],
    cidadeUf: ['', Validators.required]
  });

  companyIdentifierFormControl = new FormControl('', [this.validateCompanyIdentifier(this.empresasList, this.empresaId), Validators.required]);

  perfilFormControl = this.formBuilder.group({
    createdAt: [new Date()],
    deletedAt: [null],
    nomeGrupo: ["", [Validators.required]],
    status: [true],
    updatedAt: [new Date()],
    empresaId: [null],
    permissoes:[{
      acesso: 'total',
      cartorio: 'total',
      contratante: 'total',
      contrato: 'total',
      funcionario: 'total',
      imovel: 'total',
      nucleo: 'total',
      plano: 'total',
      prefeitura: 'total',
      status: 'total',
      usuario: 'total',
      vendedor: 'total',
      gerenciar_documento: 'total',
      empresas: 'restrito'
    }]
  });

  usuarioFormControl = this.formBuilder.group({
    "email": ['', [Validators.required, Validators.email]], 
    "senha": ['', Validators.required],
    "nome": ['', Validators.required],
    "telefone": ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]], 
    "cpf": ['', [Validators.required]],
    "perfil": [{id:'', nomeGrupo: ''}],
    "empresaId": [null],
    "createdAt": new Date(),
    "empresaPrincipal": [false],
    "deletedAt": null,
    "updatedAt": new Date(),
  });

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }
    this.findEmpresas();

    this.formControls = this.formBuilder.group({
      id: [0],
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, this.validateService.validateCPForCNPJ]],
      telefone: ['', Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)],
      email: ['', [Validators.email]],
      endereco: this.enderecoFormControl,
      principal: [false],
      companyIdentifier: this.companyIdentifierFormControl,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: new Date(),
      acessoAdmin: null,
      userAdmin: null,
    });

    this.route.params.subscribe(params => {
       this.empresaId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    if(this.empresaId){
      this.empresaService.findById(this.empresaId).subscribe(empresa => {
        this.formControls?.patchValue({
          id: empresa.id || '',
          nome: empresa.nome || '',
          cnpj: this.validateService.formatCpfCnpj(empresa.cnpj),
          companyIdentifier: empresa.companyIdentifier || '',
          telefone: empresa.telefone || '',
          email: empresa.email || '',
          principal: empresa.principal || false,
          createdAt: empresa.createdAt || new Date(),
          deletedAt: empresa.deletedAt || null,
          updatedAt: empresa.updatedAt || new Date(),
          acessoAdmin: empresa.acessoAdmin || null,
          userAdmin: empresa.userAdmin || null
        });

        this.companyIdentifierFormControl.setValue(empresa.companyIdentifier || '')

        this.formControls.get('endereco')?.patchValue({
          rua: empresa.endereco?.rua || '',
          numero: empresa.endereco?.numero || '',
          bairro: empresa.endereco?.bairro || '',
          complemento: empresa.endereco?.complemento || '',
          cep: empresa.endereco?.cep || '',
          cidadeUf: empresa.endereco?.cidadeUf || ''
        });

        this.perfilFormControl?.get('empresaId')?.setValue(empresa.id || '');

        if(empresa?.userAdmin?.id){
          this.userId = empresa?.userAdmin?.id;
          this.usuarioFormControl?.patchValue({
            email: empresa?.userAdmin?.email || '',
            cpf: empresa?.userAdmin?.cpf || '',
            senha: empresa?.userAdmin?.senha || '',
            telefone: empresa?.userAdmin?.telefone || '',
            empresaId: empresa?.userAdmin?.empresaId || null,
            nome: empresa?.userAdmin?.nome || '',
            empresaPrincipal: empresa.principal || false,
            perfil: empresa?.userAdmin?.perfil || null,
            createdAt: empresa?.userAdmin?.createdAt || null,
            deletedAt: empresa?.userAdmin?.deletedAt || null,
            updatedAt: empresa?.userAdmin?.updatedAt || null,
          });
        }else{
          this.usuarioFormControl?.get('empresaId')?.setValue(empresa.id || '');
          this.usuarioFormControl?.get('perfil')?.setValue(empresa.acessoAdmin || '');
        }
      });        
    }
  }

  findEmpresas(){
    this.empresaService.getItems().subscribe(empresas => { 
      if (empresas.length >= 0) {
        this.empresasList = empresas;
      }
    });

    this.empresaService.getItems().subscribe((empresas)=>{
      if (empresas.length >= 0) {
        this.empresasList = empresas;
      }
      
    this.companyIdentifierFormControl = new FormControl('', [
        this.validateCompanyIdentifier(this.empresasList, this.empresaId), Validators.required]);
    });
  }

  buscarEndereco() {
    this.formControls.get('endereco')?.get('cep')?.value;
    if(this.formControls.get('endereco')?.get('cep')?.value){
      this.formControls.get('endereco')?.get('rua')?.setValue("");
      this.formControls.get('endereco')?.get('bairro')?.setValue("");
      this.formControls.get('endereco')?.get('cidadeUf')?.setValue("")

      if (this.formControls.get('endereco')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(this.formControls.get('endereco')?.get('cep')?.value)
          .subscribe(
            data => {
              if(!data.erro){
                this.formControls.get('endereco')?.get('rua')?.setValue(data.logradouro);
                this.formControls.get('endereco')?.get('bairro')?.setValue(data.bairro);
                this.formControls.get('endereco')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.formControls.get('endereco')?.get('rua')?.setValue("");
                this.formControls.get('endereco')?.get('bairro')?.setValue("");
                this.formControls.get('endereco')?.get('cidadeUf')?.setValue("")
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  formatPhone() {
    const valuePhone = this.formControls?.getRawValue()?.telefone;
    if(valuePhone){
      let telefone = valuePhone.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.formControls?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  formatPhoneUser() {
    const valuePhone = this.usuarioFormControl?.getRawValue()?.telefone;
    if(valuePhone){
      let telefone = valuePhone.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.usuarioFormControl?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.usuarioFormControl?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  formValid(): boolean {
    return (
      this.formControls.valid && this.companyIdentifierFormControl.valid
    );
  }

  formValidAcesso(): boolean {
    return (
      this.perfilFormControl.valid
    );
  }

  

  maskCpfCnpj(name: string){
    this.formControls?.get(name)?.setValue(this.validateService.formatCpfCnpj(this.formControls?.get(name)?.value))
  }

  maskCpfCnpjUser(name: string){
    this.usuarioFormControl?.get(name)?.setValue(this.validateService.formatCpfCnpj(this.usuarioFormControl?.get(name)?.value))
  }

  cpfCnpjLength() {
    const value = this.formControls?.get('cnpj')?.value || '';
    return value.replace(/\D/g, '').length;
  }

  cpfCnpjLengthUser(){
    const value = this.usuarioFormControl?.get('cpf')?.value || '';
    return value.replace(/\D/g, '').length;
  }

  handleKeyUpCompanyIdentifier(event: any) {
    this.formControls?.get('companyIdentifier')?.setValue(event.target.value.replace(" ", "_"));
    this.companyIdentifierFormControl.setValue(event.target.value.replace(" ", "_"));
    this.companyIdentifierFormControl.updateValueAndValidity();
  }
  
  validateCompanyIdentifier(empresas: any[], id = ""): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (id) {
        if(empresas.some(item => item?.companyIdentifier?.toLowerCase() == value?.toLowerCase() && item?.id != id)){
          return { 'invalid': true };
        }
        return null;
      }else{
        if(empresas.some(item => item?.companyIdentifier?.toLowerCase() == value?.toLowerCase())){
          return { 'invalid': true };
        }
        return null;
      }
    };
  }

  async create() {
    const body = this.formControls.getRawValue();
    body.cnpj = body.cnpj.replace(/\D/g, '');

    if (body.cnpj) {
      try {
        const cnpjExists = await this.empresaService.checkIfcnpjExists(body.cnpj).toPromise(); 
  
        if (!cnpjExists) {
          await this.empresaService.save(body); 
          this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
          this.router.navigate(['/empresas/lista']);
        } else {
          this.toolboxService.showTooltip('error', 'CNPJ já cadastrado no banco de dados!', 'ERROR!');
        }
      } catch (error) {
        this.toolboxService.showTooltip('error', 'Ocorreu um erro ao cadastrar o empresa.', 'Erro!');
      }
    }
  }

  async update(){
    this.formControls?.get('updatedAt')?.setValue(new Date());
    const body = this.formControls.getRawValue();
    body.cnpj = body.cnpj.replace(/\D/g, '');

    if (this.formControls?.get('cnpj')?.getRawValue()) {
      await this.empresaService.updateItem(this.empresaId, body)
    }
  }

  async createAcesso() {
    try {
       const result = await this.acessoService.save(this.perfilFormControl.getRawValue());

       if(result.id){
        this.formControls?.get('acessoAdmin')?.setValue({id: result.id, nomeGrupo: result.nomeGrupo || ''});
        await this.update();
       }
    } catch (error) {
      this.toolboxService.showTooltip('error', 'Ocorreu um erro ao cadastrar Acesso da empresa.', 'Erro!');
    }
  }

  async createUser() {
    const item = this.usuarioFormControl.getRawValue()
    if(item.cpf){
      this.usuarioService.checkIfCPFExists(item.cpf).toPromise().then(async cpfExists => {
        if (!cpfExists) {
          const result = await this.usuarioService.saveUser(item);
          this.toolboxService.showTooltip('success', 'Usuario Admin realizado com sucesso!', 'Sucesso!');
          console.log(result)
          if(result.id){
            this.formControls?.get('userAdmin')?.setValue(result);
            await this.update();
          }
          return Promise.resolve();
        } else {
            this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
            return Promise.resolve();
        }
      });
    }
  }

  async updateUser(){
    const item = this.usuarioFormControl.getRawValue()
    if(item.cpf){
      this.usuarioService.checkIfCPFExists(item.cpf).toPromise().then(async cpfExists => {
        if (!cpfExists) {
          const result = await this.usuarioService.updateItem(this.userId, item);
          console.log(result)
          if(result.id){
            this.formControls?.get('userAdmin')?.setValue(result);
            await this.update();
          }
          return Promise.resolve();
        } else {
            this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
            return Promise.resolve();
        }
      });
    }
  }
}
