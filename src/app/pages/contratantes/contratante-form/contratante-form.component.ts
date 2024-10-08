import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/utils/validate.service';
import { ContratantesService } from '../../../services/contratantes.service';
import { EstadoCivilService } from '../../../services/estadoCivil.service';
import { CartoriosService } from '../../../services/cartorios.service';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-contratante-form',
  templateUrl: './contratante-form.component.html',
  styleUrl: './contratante-form.component.css'
})
export class ContratanteFormComponent {
  contratanteId = "";
  access: any = '';

  isMarried = false;
  databaseInfo: any = {};
  estadoCivil: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  formControls!: FormGroup;
  showAnexos: boolean  = false;
  filteredCartorios: any[] = [];
  cartorios: any[] = [];
  timeoutId: any;
  arrayValidateCpfSocio = [];

  loadingCartorio: boolean = false;
  
  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private validateService: ValidateService,
    private formBuilder: FormBuilder, private contratantesService: ContratantesService,
    private estadoCivilService: EstadoCivilService, private cartoriosService: CartoriosService,
    private  authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.contratante;
      });
    }
  anexosFormControl = this.formBuilder.group({
    rgFile: [{base64: '',type: ''}],
    cpfFile: [{base64: '',type: ''}],
    comprovanteAquisicaoImovelFile: [{base64: '',type: ''}],
    comprovanteEnderecofile: [{base64: '',type: ''}],
    cetidaoCasamentoFile:[{base64: '',type: ''}],
    rgConjugueFile:[{base64: '',type: ''}],
    cpfConjugueFile:[{base64: '',type: ''}]
  });

  cartorioFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    cns: ['', [Validators.required, this.validateService.validateCNS]],
    cidadeUf:  ['', Validators.required]
  });

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, this.validateService.validateCPForCNPJ]],
      rg: [''],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      nacionalidade: ['', [Validators.required]],
      orgaoExpedicao:['', [Validators.required]],
      profissao: ['', [Validators.required]],
      estadoCivil: ['', [Validators.required]],
      nomeConjugue: [''],
      dataExpedicao:  [''],
      nacionalidadeConjugue: [''],
      estrangeiro: [false],
      rne: [''],
      razao_social: [''],
      pessoa_juridica: [''],
      cpf_socio: ['', [this.validateService.validateCPF]],
      cartorio: this.cartorioFormControls,
      anexos: this.anexosFormControl
    });

    this.route.params.subscribe(params => {
       this.contratanteId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    if(this.contratanteId){
      this.contratantesService.findById(this.contratanteId).subscribe(contratante => {
        this.formControls?.get('id')?.setValue(contratante.id);
        this.formControls?.get('nome')?.setValue(contratante.nome);

        this.formControls?.get('cpf')?.setValue( this.validateService.formatCpfCnpj(contratante.cpf));

        this.formControls?.get('rg')?.setValue(contratante.rg);
        this.formControls?.get('email')?.setValue(contratante.email);
        this.formControls?.get('telefone')?.setValue(contratante.telefone);
        this.formControls?.get('nacionalidade')?.setValue(contratante.nacionalidade);
        this.formControls?.get('profissao')?.setValue(contratante.profissao);
        this.formControls?.get('estadoCivil')?.setValue(contratante.estadoCivil);
        this.formControls?.get('nomeConjugue')?.setValue(contratante.nomeConjugue);
        this.formControls?.get('nacionalidadeConjugue')?.setValue(contratante.nacionalidadeConjugue);
        this.formControls?.get('orgaoExpedicao')?.setValue(contratante.orgaoExpedicao);

        if(contratante.estrangeiro){
          this.formControls?.get('estrangeiro')?.setValue(contratante.estrangeiro);
          this.formControls?.get('rne')?.setValue(contratante.rne);
          this.isEstrangeiro({checked: true})
        }

        if(contratante.cpf > 11){
          if(contratante.razao_social){
            this.formControls?.get('razao_social')?.setValue(contratante.razao_social);
          }
          
          if(contratante.pessoa_juridica){
            this.formControls?.get('pessoa_juridica')?.setValue(contratante.pessoa_juridica);
          }

          if(contratante.cpf_socio){
            this.formControls?.get('cpf_socio')?.setValue(contratante.cpf_socio);

            this.formControls?.get('cpf_socio')?.setValue(this.validateService.formatCpfCnpj(contratante.cpf_socio));
          }
        }

        if(contratante.dataExpedicao){
          const dataEmMilliseconds = contratante.dataExpedicao.seconds * 1000 + Math.floor(contratante.dataExpedicao.nanoseconds / 1000000);
            const data = new Date(dataEmMilliseconds);
          this.formControls?.get('dataExpedicao')?.setValue(data);
        }

        this.formControls.get('anexos')?.get('rgFile')?.setValue(contratante.anexos.rgFile);
        this.formControls.get('anexos')?.get('cpfFile')?.setValue(contratante.anexos.cpfFile);
        this.formControls.get('anexos')?.get('comprovanteAquisicaoImovelFile')?.setValue(contratante.anexos.comprovanteAquisicaoImovelFile);
        this.formControls.get('anexos')?.get('comprovanteEnderecofile')?.setValue(contratante.anexos.comprovanteEnderecofile);
        this.formControls.get('anexos')?.get('cetidaoCasamentoFile')?.setValue(contratante.anexos.cetidaoCasamentoFile);
        this.formControls.get('anexos')?.get('rgConjugueFile')?.setValue(contratante.anexos.rgConjugueFile);
        this.formControls.get('anexos')?.get('cpfConjugueFile')?.setValue(contratante.anexos.cpfConjugueFile);

        this.formControls.get('cartorio')?.get('nome')?.setValue(contratante.cartorio.nome);
        this.formControls.get('cartorio')?.get('cns')?.setValue(contratante.cartorio.cns);
        this.formControls.get('cartorio')?.get('cidadeUf')?.setValue(contratante.cartorio.cidadeUf);

        if(contratante.estadoCivil == 'Casado' || contratante.estadoCivil == 'União Estável'){
          this.isMarried = true;
        }
        this.selectEstadoCivil();
        this.showAnexos = true;
      });        
    }else{
      this.showAnexos = true;
    }

    this.estadoCivil = this.estadoCivilService.getEstadoCivil(); 
    this.findAllCartorios();
  }

  findAllCartorios(){
    this.cartoriosService.getItems().subscribe(cartorios => { 
      if (cartorios.length >= 0) {
        this.cartorios  = cartorios;
        this.filteredCartorios  = cartorios;
      }
    });
  }

  async create() {
    const body = this.formControls.getRawValue();
    body.cpf = body.cpf.replace(/\D/g, '');

    if(body.cpf.length == 11 ){
        this.formControls?.get('razao_social')?.setValue("");
        this.formControls?.get('pessoa_juridica')?.setValue("");
        this.formControls?.get('cpf_socio')?.setValue("");
    }

    body.cpf_socio ? body.cpf_socio = body.cpf_socio.replace(/\D/g, '') : body.cpf_socio = "";

    if (body.cpf) {
      try {
        const cpfExists = await this.contratantesService.checkIfCPFExists(body.cpf).toPromise(); 
  
        if (!cpfExists) {
          await this.contratantesService.save(body); 
          this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
          this.router.navigate(['/contratante/lista']);
        } else {
          this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
        }
      } catch (error) {
        this.toolboxService.showTooltip('error', 'Ocorreu um erro ao cadastrar o contratante.', 'Erro!');
      }
    }
  }

  maskCpfCnpj(name: string){
    this.formControls?.get(name)?.setValue(this.validateService.formatCpfCnpj(this.formControls?.get(name)?.value))
  }

  async update(){
    const body = this.formControls.getRawValue();
    body.cpf = body.cpf.replace(/\D/g, '');

    if(body.cpf.length == 11 ){
      this.formControls?.get('razao_social')?.setValue("");
      this.formControls?.get('pessoa_juridica')?.setValue("");
      this.formControls?.get('cpf_socio')?.setValue("");
    }

    body.cpf_socio ? body.cpf_socio = body.cpf_socio.replace(/\D/g, '') : body.cpf_socio = "";

    if (this.formControls?.get('cpf')?.getRawValue()) {
      await this.contratantesService.updateItem(this.contratanteId, body)
    }
  }

  selectEstadoCivil() {
    const estadoCivilAtual = this.formControls?.get('estadoCivil')?.value?.toString();
    
    if (estadoCivilAtual === 'Casado' || estadoCivilAtual === 'União Estável') {
      this.isMarried = true;
      this.formControls?.get('nomeConjugue')?.setValidators([Validators.required]);
      this.formControls?.get('nacionalidadeConjugue')?.setValidators([Validators.required]);
    } else {
      this.isMarried = false;
      this.formControls?.get('nomeConjugue')?.clearValidators();
      this.formControls?.get('nacionalidadeConjugue')?.clearValidators();
      this.formControls?.get('nomeConjugue')?.setValue("");
      this.formControls?.get('nacionalidadeConjugue')?.setValue("");
    }

    this.formControls?.get('nomeConjugue')?.updateValueAndValidity();
    this.formControls?.get('nacionalidadeConjugue')?.updateValueAndValidity();
  }

  formValid(): boolean {
    return (
      this.formControls.valid
    );
  }

  
  formatPhone() {
    if(this.formControls?.get('telefone')?.value){
      let telefone = this.formControls?.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.formControls?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  cpfCnpjLength() {
    const value = this.formControls?.get('cpf')?.value || '';
    return value.replace(/\D/g, '').length;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
    }
  }

  saveFileBase64(event: { base64: string, type: string }, fileName: string){
    this.anexosFormControl?.get(fileName)?.patchValue(event);
  }

  handleKeyUp(event: any) {
    this.loadingCartorio = true;
    clearTimeout(this.timeoutId); 
    const nome = event.target.value.trim();
    if (nome.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.findCartorios(nome);
      }, 2000); 
    } else {

      this.filteredCartorios = [];
    }
  }
  
  findCartorios(nome: string) {
    this.filteredCartorios = this.cartorios.filter((item: any) => {
      return item.nome?.toLowerCase().includes(nome.toLowerCase());
    });
    this.loadingCartorio = false;
  }

  selectedCartorio(item: any){
    this.loadingCartorio = false;
    if(item){
      if(item.nome){
        this.formControls.get('cartorio')?.get('nome')?.setValue(item.nome);
      }
      if(item.cns){
        this.formControls.get('cartorio')?.get('cns')?.setValue(item.cns);
      }

      if(item.endereco.cidadeUf){
        this.formControls.get('cartorio')?.get('cidadeUf')?.setValue(item.endereco.cidadeUf);
      }
    }
  }

  isEstrangeiro(event: any){
    if (event.checked) {
      this.formControls?.get('estrangeiro')?.setValue(true);
      this.formControls?.get('rg')?.setValue('');
      this.formControls?.get('orgaoExpedicao')?.setValue('');
      this.formControls?.get('dataExpedicao')?.setValue('');
      this.formControls?.get('rg')?.clearValidators();
      this.formControls?.get('orgaoExpedicao')?.clearValidators();

      this.formControls?.get('rne')?.setValidators([Validators.required]);
    } else {
      this.formControls?.get('estrangeiro')?.setValue(false);
      this.formControls?.get('rne')?.setValue('');
      this.formControls?.get('orgaoExpedicao')?.setValue('');
      this.formControls?.get('rne')?.clearValidators();

      this.formControls?.get('rg')?.setValidators([Validators.required]);
      this.formControls?.get('orgaoExpedicao')?.setValidators([Validators.required]);
    }

    
    this.formControls?.get('rg')?.updateValueAndValidity();
    this.formControls?.get('orgaoExpedicao')?.updateValueAndValidity();
    this.formControls?.get('rne')?.updateValueAndValidity();
  }
}
