import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../../services/utils/cep.service';
import { ValidateService } from '../../../services/utils/validate.service';
import { VendedoresService } from '../../../services/vendedores.service';

@Component({
  selector: 'app-vendedor-form',
  templateUrl: './vendedor-form.component.html',
  styleUrl: './vendedor-form.component.css'
})
export class VendedorFormComponent {

  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private validateService: ValidateService,
    private vendedoresService: VendedoresService,  private formBuilder: FormBuilder) {}

  vendedorId = "";
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  pagList: any[] = [
    { id: 1, nome: 'Cartão de Crédito' },
    { id: 2, nome: 'Boleto Bancário' },
    { id: 3, nome: 'Carteira Digital' },
    { id: 4, nome: 'PIX' },
    { id: 5, nome: 'Transferência Bancária' }
  ]

  teste = {
    agencia:'',
    conta: '',
    digito: '',
    banco: '',
    tipo: 0
  }

  nomeFormControl = new FormControl('', Validators.required);
  cpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPForCNPJ]);
  ruaFormControl = new FormControl('', [Validators.required]);
  numeroFormControl = new FormControl('', [Validators.required]);
  bairroFormControl = new FormControl('', [Validators.required]);
  complementoFormControl = new FormControl('');
  cidadeUfFormControl = new FormControl('', [Validators.required]);
  rgFormControl = new FormControl('');
  cepFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);
  fotoFormControl = new FormControl({base64: '',type: ''});
  perfilFormControl = new FormControl('', Validators.required);
  formaPagamentoFormControl = new FormControl([], Validators.required);

  dadosBancariosFormControls = new FormControl({
    agencia:'',
    conta: '',
    digito: '',
    banco: '',
    tipo: 0
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.vendedorId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    if(this.vendedorId){
      this.vendedoresService.findById(this.vendedorId).subscribe(vendedor => {
            this.nomeFormControl.setValue(vendedor.nome);
            this.cpfFormControl.setValue(vendedor.cpf);
            this.emailFormControl.setValue(vendedor.email);
            this.telefoneFormControl.setValue(vendedor.telefone);
            this.rgFormControl.setValue(vendedor.rg);
            this.ruaFormControl.setValue(vendedor.rua);
            this.numeroFormControl.setValue(vendedor.numero);
            this.bairroFormControl.setValue(vendedor.bairro);
            this.complementoFormControl.setValue(vendedor.complemento);
            this.cidadeUfFormControl.setValue(vendedor.cidadeUf);
            this.cepFormControl.setValue(vendedor.cep);
            this.fotoFormControl.patchValue(vendedor.foto);
            this.perfilFormControl.setValue(vendedor.perfil);
            this.formaPagamentoFormControl.setValue(vendedor.formaPagamento);
      
            if(vendedor.dadosBancarios){
              this.dadosBancariosFormControls.setValue(vendedor.dadosBancarios);
              this.teste = vendedor.dadosBancarios;
            }
      });
    }
  }

  create() {
    const item =  {
      "nome":this.nomeFormControl.value,
      "cpf":this.cpfFormControl.value,
      "rua": this.ruaFormControl.value,
      "numero": this.numeroFormControl.value,
      "bairro": this.bairroFormControl.value,
      "complemento": this.complementoFormControl.value,
      "cidadeUf": this.cidadeUfFormControl.value,
      "rg":this.rgFormControl.value,
      "email": this.emailFormControl.value,
      "telefone":this.telefoneFormControl.value,
      "cep": this.cepFormControl.value,
      "foto": this.fotoFormControl.value,
      "perfil": this.perfilFormControl.value,
      "formaPagamento": this.formaPagamentoFormControl.value,
      "dadosBancarios": this.teste
    };
 
    if(item.cpf){
      this.vendedoresService.checkIfCPFExists(item.cpf).toPromise().then(cpfExists => {
        if (!cpfExists) {
          this.vendedoresService.save(item);
          this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
  
          this.router.navigate(['/vendedor/lista']);
          return Promise.resolve();
        } else {
            this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
            return Promise.resolve();
        }
      });
    }
  }

  update() {
   const item = {
          "id": this.vendedorId,
          "nome":this.nomeFormControl.value,
          "cpf":this.cpfFormControl.value,
          "email": this.emailFormControl.value,
          "telefone":this.telefoneFormControl.value,
          "rg":this.rgFormControl.value,
          "rua": this.ruaFormControl.value,
          "numero": this.numeroFormControl.value,
          "bairro": this.bairroFormControl.value,
          "complemento": this.complementoFormControl.value,
          "cidadeUf": this.cidadeUfFormControl.value,
          "cep": this.cepFormControl.value,
          "foto": this.fotoFormControl.value,
          "perfil": this.perfilFormControl.value,
          "formaPagamento": this.formaPagamentoFormControl.value,
          "dadosBancarios": this.teste
        };
    if(item.cpf){
      this.vendedoresService.updateItem(this.vendedorId, item)
    }
  }

  formValid(): boolean {
    return (
        this.nomeFormControl.valid &&
        this.cpfFormControl.valid &&
        this.ruaFormControl.valid &&
        this.numeroFormControl.valid &&
        this.bairroFormControl.valid &&
        this.cidadeUfFormControl.valid &&
        this.emailFormControl.valid &&
        this.telefoneFormControl.valid &&
        this.perfilFormControl.valid &&
        this.formaPagamentoFormControl.valid
    );
  }

  isAuthenticated() {
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
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

  findAddress() {
    if(this.cepFormControl.value){
      this.cleanAddress();

      if (this.cepFormControl.value.toString().length === 8) {
        this.cepService.getAddressByCep(this.cepFormControl.value)
          .subscribe(
            data => {
              if(!data.erro){
                this.ruaFormControl.setValue(data.logradouro);
                this.bairroFormControl.setValue(data.bairro);
                this.cidadeUfFormControl.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.cleanAddress();
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
    
  }

  cleanAddress() {
    this.ruaFormControl.setValue('');
    this.bairroFormControl.setValue('');
    this.cidadeUfFormControl.setValue('');
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
    }
  }

  saveFileBase64(event: { base64: string, type: string }) {
    this.fotoFormControl?.patchValue(event);
  }
}
