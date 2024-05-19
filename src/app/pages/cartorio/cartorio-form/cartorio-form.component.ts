import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../../services/utils/cep.service';
import { ValidateService } from '../../../services/utils/validate.service';
import { CartoriosService } from '../../../services/cartorios.service';

@Component({
  selector: 'app-cartorio-form',
  templateUrl: './cartorio-form.component.html',
  styleUrl: './cartorio-form.component.css'
})
export class CartorioFormComponent {
  cartorioId = "";
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  formControls!: FormGroup; 

  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private formBuilder: FormBuilder,
    private validateService: ValidateService, private cartoriosService: CartoriosService
    ) {}

  enderecoFormControls = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required],
    cep: ['', Validators.required]
  });

  representanteFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    nacionalidade: ['', Validators.required],
    cpf: ['', [Validators.required, this.validateService.validateCPF]],
    rg: ['', [Validators.required]],
    cargo:['', [Validators.required]],
  });



  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, this.validateService.validateCNPJ]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      cns:['', [Validators.required, this.validateService.validateCNS]],
      representante: this.representanteFormControls,
      endereco: this.enderecoFormControls,
    });

    this.route.params.subscribe(params => {
       this.cartorioId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();


    if(this.cartorioId){
      this.cartoriosService.findById(this.cartorioId).subscribe(cartorio => {
        this.formControls.get('nome')?.setValue(cartorio.nome);
        this.formControls.get('cnpj')?.setValue(cartorio.cnpj);
        this.formControls.get('telefone')?.setValue(cartorio.telefone);
        this.formControls.get('email')?.setValue(cartorio.email);
        this.formControls.get('cns')?.setValue(cartorio.cns);

        this.formControls.get('representante')?.get('nome')?.setValue(cartorio.representante.nome);
        this.formControls.get('representante')?.get('nacionalidade')?.setValue(cartorio.representante.nacionalidade);
        this.formControls.get('representante')?.get('cpf')?.setValue(cartorio.representante.cpf);
        this.formControls.get('representante')?.get('rg')?.setValue(cartorio.representante.rg);

        this.formControls.get('representante')?.get('cargo')?.setValue(cartorio.representante.cargo);

        this.formControls.get('endereco')?.get('rua')?.setValue(cartorio.endereco.rua);
        this.formControls.get('endereco')?.get('cep')?.setValue(cartorio.endereco.cep);
        this.formControls.get('endereco')?.get('bairro')?.setValue(cartorio.endereco.bairro);
        this.formControls.get('endereco')?.get('cidadeUf')?.setValue(cartorio.endereco.cidadeUf);
        this.formControls.get('endereco')?.get('complemento')?.setValue(cartorio.endereco.complemento);
        this.formControls.get('endereco')?.get('numero')?.setValue(cartorio.endereco.numero);
      })         
    }
  }

  async create() {
    const cnpj = this.formControls?.get('cnpj')?.getRawValue(); 

    if (cnpj) {
      try {
        const cnpjExists = await this.cartoriosService.checkIfcnpjExists(cnpj).toPromise(); 
  
        if (!cnpjExists) {
          await this.cartoriosService.save(this.formControls.getRawValue()); 
          this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
          this.router.navigate(['/cartorio/lista']);
        } else {
          this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
        }
      } catch (error) {

        this.toolboxService.showTooltip('error', 'Ocorreu um erro ao cadastrar o contratante.', 'Erro!');
      }
    }
  }

  async update(){
    if (this.formControls?.get('cnpj')?.getRawValue()) {
      await this.cartoriosService.updateItem(this.cartorioId, this.formControls.getRawValue())
    }
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
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
  
  validarGrupo(formGroup: FormGroup): boolean {
    let isValid = true;
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control && !control.valid) {
        isValid = false;
      }
    });

    return isValid;
  }
}
