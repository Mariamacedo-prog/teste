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

@Component({
  selector: 'app-imovel-form',
  templateUrl: './imovel-form.component.html',
  styleUrl: './imovel-form.component.css'
})
export class ImovelFormComponent {
  imovelId = '';
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
    public sanitizer:DomSanitizer
    ) {}

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
    cep: ['']
  });

  enderecoDefinitivo = this.formBuilder.group({
    rua: [''],
    numero: [''],
    bairro: [''],
    nucleoInformalDefinitivo: [''],
    complemento: [''],
    cidadeUf: [''],
    cep: [''],
    matricula: ['']
  });

  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      enderecoPorta: this.enderecoPorta,
      enderecoProjeto: this.enderecoProjeto,
      enderecoDefinitivo: this.enderecoDefinitivo,
      contratante: this.contratante
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
        this.formControls.get('contratante')?.get('nome')?.setValue(imovel?.contratante?.nome);
        this.formControls.get('contratante')?.get('cpf')?.setValue(imovel?.contratante?.cpf);
        this.formControls.get('contratante')?.get('id')?.setValue(imovel?.contratante?.id);
        

        this.formControls.get('enderecoPorta')?.get('rua')?.setValue(imovel.enderecoPorta.rua);
        this.formControls.get('enderecoPorta')?.get('cep')?.setValue(imovel.enderecoPorta.cep);
        this.formControls.get('enderecoPorta')?.get('bairro')?.setValue(imovel.enderecoPorta.bairro);
        this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue(imovel.enderecoPorta.cidadeUf);
        this.formControls.get('enderecoPorta')?.get('complemento')?.setValue(imovel.enderecoPorta.complemento);
        this.formControls.get('enderecoPorta')?.get('numero')?.setValue(imovel.enderecoPorta.numero);
        this.formControls.get('enderecoPorta')?.get('iptu')?.setValue(imovel.enderecoPorta.iptu);
        this.formControls.get('enderecoPorta')?.get('nucleoInformal')?.setValue(imovel.enderecoPorta.nucleoInformal);
        this.formControls.get('enderecoPorta')?.get('fotos')?.setValue(imovel.enderecoPorta.fotos);


        this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue(imovel.enderecoDefinitivo.rua);
        this.formControls.get('enderecoDefinitivo')?.get('cep')?.setValue(imovel.enderecoDefinitivo.cep);
        this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue(imovel.enderecoDefinitivo.bairro);
        this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue(imovel.enderecoDefinitivo.cidadeUf);
        this.formControls.get('enderecoDefinitivo')?.get('complemento')?.setValue(imovel.enderecoDefinitivo.complemento);
        this.formControls.get('enderecoDefinitivo')?.get('numero')?.setValue(imovel.enderecoDefinitivo.numero);
        this.formControls.get('enderecoDefinitivo')?.get('nucleoInformalDefinitivo')?.setValue(imovel.enderecoDefinitivo.nucleoInformalDefinitivo);
        this.formControls.get('enderecoDefinitivo')?.get('matricula')?.setValue(imovel.enderecoDefinitivo.matricula);


        this.formControls.get('enderecoProjeto')?.get('rua')?.setValue(imovel.enderecoProjeto.rua);
        this.formControls.get('enderecoProjeto')?.get('cep')?.setValue(imovel.enderecoProjeto.cep);
        this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue(imovel.enderecoProjeto.bairro);
        this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue(imovel.enderecoProjeto.cidadeUf);
        this.formControls.get('enderecoProjeto')?.get('nucleoInformalProjeto')?.setValue(imovel.enderecoProjeto.nucleoInformalProjeto);
        this.formControls.get('enderecoProjeto')?.get('quadra')?.setValue(imovel.enderecoProjeto.quadra);
        this.formControls.get('enderecoProjeto')?.get('lote')?.setValue(imovel.enderecoProjeto.lote);
        this.formControls.get('enderecoProjeto')?.get('complemento')?.setValue(imovel.enderecoProjeto.complemento);
        this.formControls.get('enderecoProjeto')?.get('numero')?.setValue(imovel.enderecoProjeto.numero);

        this.showAnexos = true;
      });
    }else{
      this.showAnexos = true;
    }

    
  }

  create() {
    console.log(this.formControls.getRawValue())
    this.imoveisService.save(this.formControls.getRawValue());
      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/imovel/lista']);


  }

  update(){
    console.log(this.formControls.getRawValue())
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

  saveFileBase64(event: any) {
    this.formControls.get('enderecoPorta')?.get('fotos')?.setValue({});
    this.formControls.get('enderecoPorta')?.get('fotos')?.setValue(event)
  }
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
    }
  }

  saveFileBaseIptu64(event: { base64: string, type: string }){
    console.log(event)
    this.formControls.get('enderecoPorta')?.get('iptu')?.patchValue(event);
  }

  handleKeyUp(event: any){
    this.loadingCpf = true;
    clearTimeout(this.timeoutId); 
    const cpf = event.target.value.trim();
    if (cpf.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.searchCpf(cpf);
      }, 2000); 
    } else {

      this.filteredCpf = [];
    }
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
