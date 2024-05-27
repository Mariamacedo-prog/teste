import { Component, ElementRef, ViewChild } from '@angular/core';
import { WordService } from '../../../services/utils/word.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratosService } from '../../../services/contratos.service';
import { ContratantesService } from '../../../services/contratantes.service';
import { EmpresasService } from '../../../services/empresas.service';
import { ImoveisService } from '../../../services/imoveis.service';
import { VendedoresService } from '../../../services/vendedores.service';
import { StatusService } from '../../../services/status.service';
import { NucleoService } from '../../../services/nucleo.service';

@Component({
  selector: 'app-contratos-form',
  templateUrl: './contratos-form.component.html',
  styleUrl: './contratos-form.component.css'
})
export class ContratosFormComponent {
  contratoId = "";
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  visualizar: boolean = false;
  formControls!: FormGroup;
  timeoutId: any;
  imoveisList: any = [];
  showSignature = false;
  signButtomActive = "";
  imovelSelecionado: string = ''; 
  showDownloadContrato = false;
  parcelamentoInfo: any = {};
  imovelDoContratante: any = {};
  existeImovel:boolean = false;

  contratantes: any[] = [];
  filteredContratantes: any[] = [];
  loadingCpf: boolean = false;

  vendedores: any[] = [];
  filteredVendedores: any[] = [];
  loadingVendedor: boolean = false;

  status: any[] = [];

  nucleos: any[] = [];
  filteredNucleos: any[] = [];
  loadingNucleo: boolean = false;
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private wordService: WordService, private contratosService: ContratosService, 
    private contratantesService: ContratantesService, private empresaService: EmpresasService, 
    private vendedoresService: VendedoresService,  private statusService: StatusService, private nucleoService: NucleoService, 
    private imoveisService: ImoveisService) {
    }

  cartorioFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    cns: ['', [Validators.required]],
    cidadeUf: ['', [Validators.required]],
  });

  enderecoFormControls = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required]
  });

  crfFormControls = this.formBuilder.group({
    numerocrf:[0],
    crfentregue:[""],
    statusentrega:[""]
  });

  contratanteFormControls = this.formBuilder.group({
    id: ['', Validators.required],
    nome: ['', Validators.required],
    cpf: [{value: '', disabled: this.visualizar}, [Validators.required]],
    rg: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    nacionalidade: ['', [Validators.required]],
    profissao: ['', [Validators.required]],
    estadoCivil: ['', [Validators.required]]
  });

  empresaFormControls = this.formBuilder.group({
    nome:["", Validators.required],
    cnpj:["", Validators.required],
    endereco: this.enderecoFormControls
  });

  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: ['', Validators.required],
      assinaturaContratante: [''],
      assinaturaContratada: [''],
      assinaturaTesteminha1: [''],
      assinaturaTesteminha2: [''],
      vendedor: [""],
      vendedor_nome: [""],
      nucleo: [""],
      nucleo_nome: [""],
      status: [""],
      createdAt: [null],
      updatedAt: [null],
      imovelId: [''],
      contratante: this.contratanteFormControls,
      crf: this.crfFormControls,
      cartorio: this.cartorioFormControls,
      empresa: this.empresaFormControls
    });

    this.route.params.subscribe(params => {
       this.contratoId = params['id'];
       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    this.findContratantes();

    this.findEmpresa();

    this.findVendedores();

    this.findStatus();

    this.findNucleos();
    
    if(this.contratoId){
      this.contratosService.findById(this.contratoId).subscribe(contrato => {
        this.formControls?.get('id')?.setValue(contrato.id);
     
        this.formControls?.get('assinaturaContratante')?.setValue(contrato.assinaturaContratante);
        this.formControls?.get('assinaturaContratada')?.setValue(contrato.assinaturaContratada);
        this.formControls?.get('assinaturaTesteminha1')?.setValue(contrato.assinaturaTesteminha1);
        this.formControls?.get('assinaturaTesteminha2')?.setValue(contrato.assinaturaTesteminha2);

        if(contrato.vendedor){
          this.formControls?.get('vendedor')?.setValue(contrato.vendedor);
          this.formControls?.get('vendedor_nome')?.setValue(contrato.vendedor.nome);  
        }

        if(contrato.nucleo){
          this.formControls?.get('nucleo')?.setValue(contrato.nucleo);
          this.formControls?.get('nucleo_nome')?.setValue(contrato.nucleo.nome);  
        }

        if(contrato.status){
          this.formControls?.get('status')?.setValue(contrato.status);
        }

        if(contrato.createdAt){
          this.formControls?.get('createdAt')?.setValue(contrato.createdAt);
        }
        
        if(contrato.updatedAt){
          this.formControls?.get('updatedAt')?.setValue(contrato.updatedAt); 
        }

        this.formControls?.get('crf')?.get('numerocrf')?.setValue(contrato.crf.numerocrf);
        this.formControls?.get('crf')?.get('crfentregue')?.setValue(contrato.crf.crfentregue);
        this.formControls?.get('crf')?.get('statusentrega')?.setValue(contrato.crf.statusentrega);

        this.formControls?.get('cartorio')?.get('nome')?.setValue(contrato.cartorio.nome);
        this.formControls?.get('cartorio')?.get('cns')?.setValue(contrato.cartorio.cns);
        this.formControls?.get('cartorio')?.get('cidadeUf')?.setValue(contrato.cartorio.cidadeUf);
     
        this.formControls?.get('contratante')?.get('id')?.setValue(contrato.contratante.id);
        this.formControls?.get('contratante')?.get('nome')?.setValue(contrato.contratante.nome);
        this.formControls?.get('contratante')?.get('cpf')?.setValue(contrato.contratante.cpf);
        this.formControls?.get('contratante')?.get('rg')?.setValue(contrato.contratante.rg);
        this.formControls?.get('contratante')?.get('email')?.setValue(contrato.contratante.email);
        this.formControls?.get('contratante')?.get('telefone')?.setValue(contrato.contratante.telefone);
        this.formControls?.get('contratante')?.get('nacionalidade')?.setValue(contrato.contratante.nacionalidade);
        this.formControls?.get('contratante')?.get('profissao')?.setValue(contrato.contratante.profissao);
        this.formControls?.get('contratante')?.get('estadoCivil')?.setValue(contrato.contratante.estadoCivil);
   
        if(contrato.imovelId){
          this.formControls?.get('imovelId')?.setValue(contrato.imovelId);
        }
        this.findImovel();
      });
    }
  }

  findContratantes(){
    this.contratantesService.getItems().subscribe((contratantes)=>{
      this.contratantes = contratantes;
    });
  }

  findVendedores(){
    this.vendedoresService.getItems().subscribe((vendedores)=>{
      this.vendedores = vendedores;
    });
  }

  findEmpresa(){
    this.empresaService.getItems().subscribe((empresas: any)=>{
      let empresa = empresas[0];

      this.formControls?.get('empresa')?.get('nome')?.setValue(empresa.nome);
      this.formControls?.get('empresa')?.get('cnpj')?.setValue(empresa.cnpj);
      this.formControls?.get('empresa')?.get('endereco')?.get('rua')?.setValue(empresa.endereco.rua);
      this.formControls?.get('empresa')?.get('endereco')?.get('numero')?.setValue(empresa.endereco.numero);
      this.formControls?.get('empresa')?.get('endereco')?.get('bairro')?.setValue(empresa.endereco.bairro);
      this.formControls?.get('empresa')?.get('endereco')?.get('complemento')?.setValue(empresa.endereco.complemento);
      this.formControls?.get('empresa')?.get('endereco')?.get('cidadeUf')?.setValue(empresa.endereco.cidadeUf);
    });
  }

  findImovel(){
    this.imoveisService.checkByContratanteId(this.formControls?.get('contratante')?.get('id')?.value).subscribe((imoveis: any)=>{
      if(imoveis.length >= 1){
        this.imoveisList = imoveis;
        this.showDownloadContrato = true;
        this.existeImovel = true;
      }else{
        this.showDownloadContrato = false;
        this.existeImovel = false;
        this.toolboxService.showTooltip('error', 'Não foi localizado o imovel deste contratante, favor registrar na tela Imovel para dar continuidade com o Contrato!', 'ERRO IMOVEL!');
      }
    });

    if(this.formControls?.get('imovelId')?.value){
      this.imoveisService.findById(this.formControls?.get('imovelId')?.value).subscribe((imovel: any)=>{
        if(imovel){
          this.imovelDoContratante = imovel;
          this.showDownloadContrato = true;
          this.existeImovel = true;
        }
      });
    }
  }

  findStatus(){
    this.statusService.getItems().subscribe((status)=>{
      this.status = status;
    });
  }

  findNucleos(){
    this.nucleoService.getItems().subscribe((nucleos)=>{
      this.nucleos = nucleos;
    });
  }

  changeImovel(event: any){
    this.imovelDoContratante = event.value;
    this.formControls?.get('imovelId')?.setValue(event.value.id);
  }

  create() {
    let nucleo = this.formControls?.get('nucleo')?.value;
    if(nucleo){
      this.formControls?.get('nucleo_nome')?.setValue(nucleo.nome);
    }
    this.formControls?.get('createdAt')?.setValue(new Date());
    this.contratosService.save(this.formControls.getRawValue());
    this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
    this.router.navigate(['/contrato/lista']);
  }

  update(){
    let nucleo = this.formControls?.get('nucleo')?.value;
    if(nucleo){
      this.formControls?.get('nucleo_nome')?.setValue(nucleo.nome);
    }
    this.formControls?.get('updatedAt')?.setValue(new Date());
    this.contratosService.updateItem(this.contratoId, this.formControls.getRawValue())
  }

  generateMatricula(){
    this.formControls?.get('crf')?.get('numerocrf')?.setValue(Math.floor(Math.random() * 10000000));
    this.formControls?.get('crf')?.get('crfentregue')?.setValue("Entregue");
    this.formControls?.get('crf')?.get('statusentrega')?.setValue("Finalizado");
  }

  formValid(): boolean {
    if (!this.formControls) {
      return false;
    }else{
      return true;
    }
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
  }


  handleKeyUpContratante(event: any) {
    this.loadingCpf = true;
    clearTimeout(this.timeoutId); 
    const cpf = event.target.value.trim();
    if (cpf.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.searchContratantes(cpf);
      }, 2000); 
    } else {
      this.filteredContratantes = [];
    }
  }
  searchContratantes(cpf: string) {
    this.contratantes.filter((item: any) => {
      if(item.cpf?.includes(cpf)){
         this.filteredContratantes.push(item);
      }  
    });
    this.loadingCpf = false;
  }
  selectContratante(item: any){
    this.formControls?.get('cartorio')?.get('nome')?.setValue(item.cartorio.nome);
    this.formControls?.get('cartorio')?.get('cns')?.setValue(item.cartorio.cns);
    this.formControls?.get('cartorio')?.get('cidadeUf')?.setValue(item.cartorio.cidadeUf);

    this.formControls?.get('contratante')?.get('id')?.setValue(item.id);
    this.formControls?.get('contratante')?.get('nome')?.setValue(item.nome);
    this.formControls?.get('contratante')?.get('cpf')?.setValue(item.cpf);
    this.formControls?.get('contratante')?.get('rg')?.setValue(item.rg);
    this.formControls?.get('contratante')?.get('email')?.setValue(item.email);
    this.formControls?.get('contratante')?.get('telefone')?.setValue(item.telefone);
    this.formControls?.get('contratante')?.get('nacionalidade')?.setValue(item.nacionalidade);
    this.formControls?.get('contratante')?.get('profissao')?.setValue(item.profissao);
    this.formControls?.get('contratante')?.get('estadoCivil')?.setValue(item.estadoCivil);
    this.filteredContratantes = [];
    this.loadingCpf = false;
    this.findImovel();
  }



  handleKeyUpVendedor(event: any) {
    this.loadingVendedor = true;
    clearTimeout(this.timeoutId); 
    const nome = event.target.value.trim();
    if (nome.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.searchVendedor(nome);
      }, 2000); 
    } else {
      this.filteredVendedores = [];
      this.loadingVendedor = false;
    }
  }
  searchVendedor(nome: string) {
    this.vendedores.filter((item: any) => {
      if(item.nome?.toLowerCase().includes(nome.toLowerCase())){
         this.filteredVendedores.push(item);
      }  
    });
    this.loadingVendedor = false;
  }
  selectVendedor(item: any){
    this.formControls?.get('vendedor')?.setValue(item);
    this.formControls?.get('vendedor_nome')?.setValue(item.nome);
    this.loadingVendedor = false;
    console.log(this.formControls.getRawValue())
  }


  handleKeyUpNucleo(event: any) {
    this.loadingNucleo = true;
    clearTimeout(this.timeoutId); 
    const nome = event.target.value.trim();
    if (nome.length >= 1) {
      this.timeoutId = setTimeout(() => {
        this.searchNucleo(nome);
      }, 2000); 
    } else {
      this.filteredNucleos = [];
      this.loadingNucleo = false;
    }
  }
  searchNucleo(nome: string) {
    this.nucleos.filter((item: any) => {
      if(item.nome?.toLowerCase().includes(nome.toLowerCase())){
         this.filteredNucleos.push(item);
      }  
    });
    this.loadingNucleo = false;
  }
  selectNucleo(item: any){
    this.filteredNucleos = []
    this.formControls?.get('nucleo')?.setValue(item);
    this.formControls?.get('nucleo_nome')?.setValue(item.nome);
    this.loadingNucleo = false;
    console.log(this.formControls.getRawValue())
  }

  receiveDataFromChild(data: any) {
    this.parcelamentoInfo = data;
  }

  receiveSignImage(data: any) {
    if(data.nome){
      this.toolboxService.showTooltip('success', 'Documento foi assinado com sucesso!', 'SUCESSO!');
      this.formControls?.get(data.nome)?.setValue(data.base64);
      this.showSignature = false;
    }else{
      this.toolboxService.showTooltip('error', 'Ocorreu algum erro!', 'ERRO!');
    }
  }

  async generateWordFile(){
    console.log(this.formControls, this.imovelDoContratante, this.parcelamentoInfo)
    await this.wordService.generateWordContratoFile(this.formControls, this.imovelDoContratante, this.parcelamentoInfo);
  }

  generateSign(nome: string){
    this.showSignature =true;
    this.signButtomActive = nome;
  }
}
