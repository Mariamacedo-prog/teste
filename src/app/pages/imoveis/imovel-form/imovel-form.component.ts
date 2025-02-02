import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/utils/validate.service';
import { CepService } from '../../../services/utils/cep.service';
import { ImoveisService } from '../../../services/imoveis.service';
import { ContratantesService } from '../../../services/contratantes.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-imovel-form',
  templateUrl: './imovel-form.component.html',
  styleUrl: './imovel-form.component.css'
})
export class ImovelFormComponent {
  imovelId = '';
  access: any = '';
  
  showAnexos: boolean  = false;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  estadoCivil: any = {};
  formControls!: FormGroup; 

  contratantes: any[] = [];
  timeoutId: any;
  filteredCpf: any[] = [];
  loadingCpf: boolean = false;
  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private formBuilder: FormBuilder, 
    private imoveisService: ImoveisService, private contratantesService: ContratantesService,
    public sanitizer:DomSanitizer,
    private  authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.imovel;
      });
    }

  contratante = this.formBuilder.group({
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    id: [0]
  });

  enderecoPorta = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    numeroPavimento: [''],
    nucleoInformal: ['', Validators.required],
    cidadeUf: ['', Validators.required],
    cep: [''],
    iptu:[''],
    fotos: {base64: '', type: ''}
  });

  enderecoProjeto = this.formBuilder.group({
    rua: [''],
    quadra: [''],
    lote: [''],
    nucleoInformalProjeto: [''],
    numero: [''],
    bairro: [''],
    complemento: [''],
    cidadeUf: [''],
    areaConstruida: [''],
    areaEdificadaProjeto: [''],
    cep: [''],
    anexarPlantas: {base64: '', type: ''}
  });

  enderecoDefinitivo = this.formBuilder.group({
    rua: [''],
    numero: [''],
    bairro: [''],
    nucleoInformalDefinitivo: [''],
    complemento: [''],
    cidadeUf: [''],
    cep: [''],
    matricula: [''],
    areaEdificadaDefinitivo: [''],
  });

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      enderecoPorta: this.enderecoPorta,
      enderecoProjeto: this.enderecoProjeto,
      enderecoDefinitivo: this.enderecoDefinitivo,
      contratante: this.contratante,
      editedPorta: false,
      editedProjeto: false,
      editedDefinitivo: false,
      empresaId: "Myx6tIheTMM2mFLpb5ZU"
    });

    this.route.params.subscribe(params => {
       this.imovelId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();
    this.findContratante();
    if(this.imovelId){
      this.imoveisService.findById(this.imovelId).subscribe(imovel => {
      

        this.formControls?.patchValue({
          id: imovel.id || '',
          empresaId: imovel.empresaId || ''
        });

        this.formControls.get('contratante')?.patchValue({
          nome: imovel.contratante?.nome || '',
          cpf: imovel.contratante?.cpf || '',
          id: imovel.contratante?.id || '',
        });

        this.formControls.get('enderecoPorta')?.patchValue({
          rua: imovel.enderecoPorta?.rua || '',
          bairro: imovel.enderecoPorta?.bairro || '',
          cidadeUf: imovel.enderecoPorta?.cidadeUf || '',
          complemento: imovel.enderecoPorta?.complemento || '',
          numeroPavimento: imovel.enderecoPorta?.numeroPavimento || '',
          numero: imovel.enderecoPorta?.numero || '',
          iptu: imovel.enderecoPorta?.iptu || '',
          nucleoInformal: imovel.enderecoPorta?.nucleoInformal || '',
          fotos: imovel.enderecoPorta?.fotos || {base64: '', type: ''},
          cep: imovel.enderecoPorta?.cep || '',
        });

        this.formControls.get('enderecoDefinitivo')?.patchValue({
          rua: imovel.enderecoDefinitivo?.rua || '',
          bairro: imovel.enderecoDefinitivo?.bairro || '',
          cidadeUf: imovel.enderecoDefinitivo?.cidadeUf || '',
          complemento: imovel.enderecoDefinitivo?.complemento || '',
          numero: imovel.enderecoDefinitivo?.numero || '',
          nucleoInformalDefinitivo: imovel.enderecoDefinitivo?.nucleoInformalDefinitivo || '',
          matricula: imovel.enderecoDefinitivo?.matricula || '',
          areaEdificadaDefinitivo: imovel.enderecoDefinitivo?.areaEdificadaDefinitivo || '',
          cep: imovel.enderecoDefinitivo?.cep || '',
        });


        this.formControls.get('enderecoProjeto')?.patchValue({
          rua: imovel.enderecoProjeto?.rua || '',
          bairro: imovel.enderecoProjeto?.bairro || '',
          cidadeUf: imovel.enderecoProjeto?.cidadeUf || '',
          nucleoInformalProjeto: imovel.enderecoProjeto?.nucleoInformalProjeto || '',
          quadra: imovel.enderecoProjeto?.quadra || '',
          lote: imovel.enderecoProjeto?.lote || '',
          complemento: imovel.enderecoProjeto?.complemento || '',
          numero: imovel.enderecoProjeto?.numero || '',
          anexarPlantas: imovel.enderecoProjeto?.anexarPlantas || {base64: '', type: ''},
          areaConstruida: imovel.enderecoProjeto?.areaConstruida || '',
          areaEdificadaProjeto: imovel.enderecoProjeto?.areaEdificadaProjeto || '',
          cep: imovel.enderecoProjeto?.cep || '',
        });



      
        if(imovel.enderecoDefinitivo.numero){
          this.formControls.get('editedDefinitivo')?.setValue(true)
        }else{
          this.buscarEnderecoDefinitivo();
        }
    
        if(imovel.enderecoProjeto.numero){
          this.formControls.get('editedProjeto')?.setValue(true)
        }else{
          this.buscarEnderecoProjeto();
        }
    
        if(imovel.enderecoPorta.numero){
          this.formControls.get('editedPorta')?.setValue(true)
        }
        this.showAnexos = true;
      });
    }else{
      this.showAnexos = true;
    }
  }

  create() {
    if(this.formControls.get('enderecoDefinitivo')?.get('numero')?.value){
      this.formControls.get('editedDefinitivo')?.setValue(true)
    }

    if(this.formControls.get('enderecoProjeto')?.get('numero')?.value){
      this.formControls.get('editedProjeto')?.setValue(true)
    }

    if(this.formControls.get('enderecoPorta')?.get('numero')?.value){
      this.formControls.get('editedPorta')?.setValue(true);
    }

    this.imoveisService.save(this.formControls.getRawValue());
    this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
    this.router.navigate(['/imovel/lista']);
  }

  update(){
    if(this.formControls.get('enderecoDefinitivo')?.get('numero')?.value){
      this.formControls.get('editedDefinitivo')?.setValue(true)
    }

    if(this.formControls.get('enderecoProjeto')?.get('numero')?.value){
      this.formControls.get('editedProjeto')?.setValue(true)
    }

    if(this.formControls.get('enderecoPorta')?.get('numero')?.value){
      this.formControls.get('editedPorta')?.setValue(true);
    }
    
    if(this.formControls.get('contratante')?.get('cpf')?.getRawValue()){
      this.imoveisService.updateItem(this.imovelId, this.formControls.getRawValue())
    }
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
  }

  buscarEnderecoDefinitivo() {
    this.formControls.get('enderecoDefinitivo')?.get('cep')?.value;
    if(  this.formControls.get('enderecoDefinitivo')?.get('cep')?.value){

      this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue("");
      this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue("");
      this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue("")

      if (  this.formControls.get('enderecoDefinitivo')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('enderecoDefinitivo')?.get('cep')?.value)
          .subscribe(
            data => {
              if(!data.erro){
                this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue(data.logradouro);
                this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue(data.bairro);
                this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue("");
                this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue("");
                this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue("")
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  buscarEnderecoProjeto() {
    this.formControls.get('enderecoProjeto')?.get('cep')?.value;
    if(  this.formControls.get('enderecoProjeto')?.get('cep')?.value){

      this.formControls.get('enderecoProjeto')?.get('rua')?.setValue("");
      this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue("");
      this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue("")

      if (  this.formControls.get('enderecoProjeto')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('enderecoProjeto')?.get('cep')?.value)
          .subscribe(
            data => {
              if(!data.erro){
                this.formControls.get('enderecoProjeto')?.get('rua')?.setValue(data.logradouro);
                this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue(data.bairro);
                this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.formControls.get('enderecoProjeto')?.get('rua')?.setValue("");
                this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue("");
                this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue("")
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  buscarEnderecoPorta() {
    this.formControls.get('enderecoPorta')?.get('cep')?.value;
    if(  this.formControls.get('enderecoPorta')?.get('cep')?.value){
      this.formControls.get('enderecoPorta')?.get('rua')?.setValue("");
      this.formControls.get('enderecoPorta')?.get('bairro')?.setValue("");
      this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue("")
      if (  this.formControls.get('enderecoPorta')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('enderecoPorta')?.get('cep')?.value)
        .subscribe(
          data => {

            if(!data.erro){
              this.formControls.get('enderecoPorta')?.get('rua')?.setValue(data.logradouro);
              this.formControls.get('enderecoPorta')?.get('bairro')?.setValue(data.bairro);
              this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
            }else{
              this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
              this.formControls.get('enderecoPorta')?.get('rua')?.setValue("");
              this.formControls.get('enderecoPorta')?.get('bairro')?.setValue("");
              this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue("")
            }
          },
          error => {
            console.error(error);
          }
        );
      }
    }
  }

  formValid(): boolean {
    return this.formControls.valid;
  }

  findContratante(){
    this.contratantesService.getItems().subscribe(contratantes => {
      if (contratantes.length >= 0) {
        this.contratantes = contratantes;
      }
    });
  }

  saveFileBase64(event: any, fieldName: string) {
    if (fieldName === 'fotos') {
      this.formControls.get('enderecoPorta')?.get('fotos')?.setValue(event);
    } else if (fieldName === 'anexarPlantas') {
      this.formControls.get('enderecoProjeto')?.get('anexarPlantas')?.setValue(event);
    }
  }
  
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
    }
  }

  saveFileBaseIptu64(event: { base64: string, type: string }){
    this.formControls.get('enderecoPorta')?.get('iptu')?.patchValue(event);
  }

  handleKeyUp(event: any){
    this.loadingCpf = true;
    clearTimeout(this.timeoutId); 
    const cpf = event.target.value.replace(/\D/g, '').trim();

    if (cpf.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.searchCpf(cpf);
      }, 2000); 
    } else {

      this.filteredCpf = [];
    }

    this.formControls.get('contratante')?.get('cpf')?.setValue(cpf);
  }

  searchCpf(cpf: string) {
    this.filteredCpf = this.contratantes.filter((item: any) => {
      return item.cpf?.includes(cpf);
    });
    this.loadingCpf = false;
  }

  selectedCpf(option: any){
    this.loadingCpf = false;
    if(option){
      this.formControls.get('contratante')?.get('nome')?.setValue(option.nome);
      this.formControls.get('contratante')?.get('id')?.setValue(option.id);
      this.formControls.get('id')?.setValue(Math.floor(Math.random() * 100000));
    }else{
      this.toolboxService.showTooltip('error', 'Contratante não encontrado na base de dados!', 'ERRO CPF!');
    }
  }
}
