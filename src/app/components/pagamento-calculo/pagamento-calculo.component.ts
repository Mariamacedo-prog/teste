import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolboxService } from '../toolbox/toolbox.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { VendasPagamentosService } from '../../services/vendasPagamentos.service';
import { PlanosService } from '../../services/planos.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface TypeSelectValue {
  entrada: number;
  formaPagamento: string;
  viewValue: string;
  id: any;
  nome: string;
  numeroParcelas: number;
  status: boolean;
  valor: number;
}

@Component({
  selector: 'app-pagamento-calculo',
  templateUrl: './pagamento-calculo.component.html',
  styleUrl: './pagamento-calculo.component.css',
  providers: [
  ],
})
export class PagamentoCalculoComponent {
  idParcelamento = 0;
  planos: TypeSelectValue[] = [];
  planosFiltered: TypeSelectValue[] = [];
  formControls!: FormGroup;
  optionsEntrada: any[] = [];
  optionsParcelas: any[] = [];
  minDate: Date = new Date();
  panelOpenState:boolean = false;
  databaseInfo: any = {};
  existeParcelamento:boolean = false;
  @Input() dataContratanteInfo: any;
  @Input() dataPlanos: any;
  @Input() dataImovelInfo: any;

  @Output() dataEvent = new EventEmitter<any>();

  constructor(private toolboxService: ToolboxService, private formBuilder: FormBuilder, 
   private vendasPagamentosService: VendasPagamentosService, 
   private planosService: PlanosService) {}

  entradaFormControls = this.formBuilder.group({
    quantidade: [0, this.formControls?.get('isAvista')?.value == true ? null : Validators.required],
    valor: [0, this.formControls?.get('isAvista')?.value == true? null : Validators.required],
    dataPrimeiroPagamento: [null, this.formControls?.get('isAvista')?.value == true? null : Validators.required],
    dataUltimoPagamento: [null],
    porcentagem: [0],
    valorTotal:[0]
  });

  parcelasFormControls = this.formBuilder.group({
    quantidade: [0, this.formControls?.get('isAvista')?.value == true? null : Validators.required],
    valor: [0, this.formControls?.get('isAvista')?.value == true ? null : Validators.required],
    dataPrimeiroPagamento: [null, this.formControls?.get('isAvista')?.value == true ? null : Validators.required],
    dataUltimoPagamento: [null],
    porcentagem: [0],
    valorTotal:[0, this.formControls?.get('isAvista')?.value == true ? null : Validators.required]
  });
  
  ngOnInit(): void {   
    this.formControls = this.formBuilder.group({
      id: [0],
      idImovel: [''],
      plano: [null, Validators.required],
      plano_valor: [null, Validators.required],
      entrada: this.entradaFormControls,
      maxParcelas: [0],
      parcelas: this.parcelasFormControls,
      isAvista: false,
      valorAvista: [null, Validators.required],
    });

    this.findPlanos();
    this.verificarContratante();
  }

  findPlanos(){
    this.planosService.getItems().subscribe((planos: any)=>{
      this.planos = planos;
      this.planosFiltered = planos;

      setTimeout(() => {
        
        this.registrarValores();
        this.calculateDataFinalEntrada();
        if(this.dataPlanos.planos && this.dataPlanos.planos.length > 0) {
          this.planosFiltered = [];
          for(let i = 0; i < this.dataPlanos.planos.length; i++) {
            this.planos.find((item) => {
              if(item.id === this.dataPlanos.planos[i]){
                this.planosFiltered.push(item)
              }
            })
          }
        }
      }, 3000);
    });
  }

  verificarContratante() {
    this.vendasPagamentosService.getItems().subscribe((vendas)=>{
      if(vendas.length >= 0){
        for(let venda of vendas){
        
          if(venda.contratante.id == this.dataContratanteInfo.id && venda.idImovel == this.dataImovelInfo) {
            this.formControls?.get('plano')?.setValue(venda.plano);
            if(venda.plano_valor){
              this.formControls?.get('plano_valor')?.setValue(venda.plano_valor);
            }else{
              this.formControls?.get('plano_valor')?.setValue(venda.plano);

              if(venda.plano == 6000){
                this.formControls?.get('plano')?.setValue('868i2kSmlbvARVwiG4tS');
              }

              if(venda.plano == 10000){
                this.formControls?.get('plano')?.setValue('z6QGeMsy1zoDahkSChBd'); 
              }

              if(venda.plano == 12000){
                this.formControls?.get('plano')?.setValue('csdo5OqSx72He39517qN'); 
              }

              if(venda.plano == 600){
                this.formControls?.get('plano')?.setValue("D8UoOnqR37T5XEBvivRP");
                console.log(venda.plano)
              }
            }

            if(venda.maxParcelas){
              this.formControls?.get('maxParcelas')?.setValue(venda.maxParcelas);
            }
            
            this.formControls?.get('id')?.setValue(venda.id);
            this.formControls?.get('isAvista')?.setValue(venda.isAvista);
            this.formControls?.get('valorAvista')?.setValue(venda.valorAvista);
            this.formControls?.get('idImovel')?.setValue(venda.idImovel);
    
            this.formControls?.get('parcelas')?.get('quantidade')?.setValue(venda?.parcelas?.quantidade);
            this.formControls?.get('parcelas')?.get('valor')?.setValue(venda?.parcelas?.valor);
            this.formControls?.get('parcelas')?.get('valorTotal')?.setValue(venda?.parcelas?.valorTotal);

            if(venda?.parcelas?.porcentagem){
              this.formControls?.get('parcelas')?.get('porcentagem')?.setValue(venda?.parcelas?.porcentagem);
            }

            if(venda?.entrada?.porcentagem){
              this.formControls?.get('entrada')?.get('porcentagem')?.setValue(venda?.entrada?.porcentagem);
            }

            if(venda?.parcelas?.dataPrimeiroPagamento){
              const dataEmMilliseconds =venda?.parcelas?.dataPrimeiroPagamento.seconds * 1000 + Math.floor(venda?.parcelas?.dataPrimeiroPagamento.nanoseconds / 1000000);
              const data = new Date(dataEmMilliseconds);
              this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(data);
            }
            if(venda?.parcelas?.dataUltimoPagamento){
              const dataEmMilliseconds =venda?.parcelas?.dataUltimoPagamento.seconds * 1000 + Math.floor(venda?.parcelas?.dataUltimoPagamento.nanoseconds / 1000000);
              const data = new Date(dataEmMilliseconds);
              this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(data);
            }
            
            if(venda?.entrada?.dataPrimeiroPagamento){
              const dataEmMilliseconds =venda?.entrada?.dataPrimeiroPagamento.seconds * 1000 + Math.floor(venda?.entrada?.dataPrimeiroPagamento.nanoseconds / 1000000);
              const data = new Date(dataEmMilliseconds);
              this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(data);
            }
            if(venda?.entrada?.dataUltimoPagamento){
              const dataEmMilliseconds =venda?.entrada?.dataUltimoPagamento.seconds * 1000 + Math.floor(venda?.entrada?.dataUltimoPagamento.nanoseconds / 1000000);
              const data = new Date(dataEmMilliseconds);
              this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(data);
            }
            this.formControls?.get('entrada')?.get('quantidade')?.setValue(venda?.entrada?.quantidade);
            console.log(venda?.entrada?.valor)
            this.formControls?.get('entrada')?.get('valor')?.setValue(venda?.entrada?.valor);
            this.formControls?.get('entrada')?.get('valorTotal')?.setValue(venda?.entrada?.valorTotal);
    
            this.dataEvent.emit(this.formControls.getRawValue());
            this.existeParcelamento = true;  
          }
        }
      }
    })   
  };

  changePlano(event: any) {
    this.listarValorEntrada();
    let value = event.value;
    if(value){
      let indexPlano = this.planos.findIndex((plano: any) => plano.id === value);

      this.optionsEntrada = [];
      this.formControls?.get('plano')?.setValue(this.planos[indexPlano].id);
      const plano = this.planos[indexPlano];
      console.log(plano)
      this.formControls?.get('entrada')?.get('porcentagem')?.setValue(((100 - (100 - plano.entrada)) / 100));
      this.formControls?.get('parcelas')?.get('porcentagem')?.setValue((((100 - plano.entrada))  / 100));
      this.formControls?.get('valorAvista')?.setValue(plano.valor);
      this.formControls?.get('plano_valor')?.setValue(plano.valor);
      this.formControls?.get('maxParcelas')?.setValue(plano.numeroParcelas);

      this.listarValorEntrada();

      if(value === 600){
        this.formControls?.get('isAvista')?.setValue(true);
      }else{
        this.formControls?.get('isAvista')?.setValue(false);
      }
      this.clearValues();
    }
  }

  listarValorEntrada(){
    this.optionsEntrada = [];
    this.optionsParcelas = [];
    this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(null);
    this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
    this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(null);
    this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);

    const porcentagemEntrada = this.formControls?.get('entrada')?.get('porcentagem')?.value ? this.formControls?.get('entrada')?.get('porcentagem')?.value : 0.10;

    const entrada = this.formControls?.get('plano_valor')?.value * porcentagemEntrada;
    let novaEntrada = parseFloat(entrada.toFixed(2));
    

    this.optionsEntrada.push({
      valor: novaEntrada,
      quant: 1,
      viewValue: `Em 1 vez de R$${novaEntrada.toFixed(2)}`
     });

     novaEntrada = novaEntrada / 2;

     this.optionsEntrada.push({
      valor: novaEntrada ,
      quant:2,
      viewValue: `Em 2 vezes de R$${novaEntrada.toFixed(2)}`
     });
  }

  changeEntrada(event: any){
    this.optionsParcelas = [];
    this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(null);
    this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);
    
    const value = event?.value; // Acessa o valor selecionado do evento
    if(value){
        const entradaX = this.optionsEntrada.find(item => item.valor === value);
        if(entradaX){
          this.formControls?.get('entrada')?.get('valor')?.setValue(entradaX.valor);
          this.formControls?.get('entrada')?.get('quantidade')?.setValue(entradaX.quant);
          this.formControls?.get('entrada')?.get('valorTotal')?.setValue(entradaX.value * entradaX.quant);

          this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(null);
          this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
          this.listarValorParcela();
        }
    }
  }

  calculateDataFinalEntrada() {
    const quantidadeParcelas = this.formControls?.get('entrada')?.get('quantidade')?.value;
    const dataPrimeiroPagamento = this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.value;
    if (quantidadeParcelas > 1 && dataPrimeiroPagamento) {
        const dataUltimoPagamento = new Date(dataPrimeiroPagamento);
        dataUltimoPagamento.setMonth(dataUltimoPagamento.getMonth() + 1);
        this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(dataUltimoPagamento);
    } else {
        this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
    }

    if(this.formControls?.get('isAvista')?.value == true){
      this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(dataPrimeiroPagamento);
    }
  }

  calculateDataFinalParcela() {
    const quantidadeParcelas = this.formControls?.get('parcelas')?.get('quantidade')?.value;
    const dataPrimeiroPagamento = this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.value;
    if (quantidadeParcelas > 1 && dataPrimeiroPagamento) {
      const dataUltimoPagamento = new Date(dataPrimeiroPagamento);
      dataUltimoPagamento.setMonth(dataUltimoPagamento.getMonth() + (quantidadeParcelas - 1));
      this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(dataUltimoPagamento);
    } else {
      this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);
    }
  }

  listarValorParcela(){
    this.optionsParcelas = [];
    const maxParcelas = this.formControls?.get('maxParcelas')?.value ? this.formControls?.get('maxParcelas')?.value : 30;
    const porcentagemParcelas = this.formControls?.get('parcelas')?.get('porcentagem')?.value ? this.formControls?.get('parcelas')?.get('porcentagem')?.value : 0.90;
    const totalParcela = this.formControls?.get('plano_valor')?.value * porcentagemParcelas;
    let novoTotalPacela = parseFloat(totalParcela.toFixed(2));

    for(let i = 1; i <= maxParcelas; i++){
      let valor = novoTotalPacela / i;
      this.optionsParcelas.push({
        valor: valor,
        quant: i,
        viewValue: `Em ${i} vez${i > 1 ? 'es' : ' '} de R$${valor.toFixed(2)}`
       });
    }
  }

  changeParcela(event: any){
    const value = event?.value; // Acessa o valor selecionado do evento
    if(value){
        const parcelax = this.optionsParcelas.find(item => item.valor === value);
        if(parcelax){
          this.formControls?.get('parcelas')?.get('valor')?.setValue(parcelax.valor);
          this.formControls?.get('parcelas')?.get('quantidade')?.setValue(parcelax.quant);
          this.formControls?.get('parcelas')?.get('valorTotal')?.setValue(parcelax.value * parcelax.quant);

          this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(null);
          this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);
        }
    }
  }

  formularioValido(): boolean {
    return this.formControls.valid;
  }

  async gerarParcelamento(){
    let item =  this.formControls.getRawValue();
    item.contratante = this.dataContratanteInfo;
    item.idImovel = this.dataImovelInfo;
    if(item){
      try {
        if(this.dataContratanteInfo.id){
         await this.vendasPagamentosService.checkIfImovelExists(this.dataImovelInfo)
          .then(imovelExists => {
            if (!imovelExists) {
              this.vendasPagamentosService.save(item);

              this.dataEvent.emit(this.formControls.getRawValue());
              this.toolboxService.showTooltip('success', 'Parcelamento realizado com sucesso!', 'Sucesso!');
              this.existeParcelamento = true;
            } 
          }) 
          .catch(error => {
              console.error("Erro ao verificar a existência do Imovel:", error);
              this.toolboxService.showTooltip('error', 'Ocorreu um erro ao verificar a existência do contratante!', 'Erro!');
          });
        }
      } catch (error) {
        this.toolboxService.showTooltip('error', 'Ocorreu um erro!', 'Erro!');
      }
    }
  }

  async atualizarParcelamento(){
    let item =  this.formControls.getRawValue();
    item.contratante = this.dataContratanteInfo;
    item.idImovel = this.dataImovelInfo;
    if(item.id){
      try {
        await this.vendasPagamentosService.checkIfImovelExists(this.dataImovelInfo)
          .then(contratanteExists => {
            if (contratanteExists) {
              this.vendasPagamentosService.updateItem(item.id, item);
              this.dataEvent.emit(this.formControls.getRawValue());
              this.toolboxService.showTooltip('success', 'Parcelamento atualizado com sucesso!', 'Sucesso!');
              this.existeParcelamento = true;
            } else {
              this.toolboxService.showTooltip('error', 'Contratante não localizado no banco de dados!', 'ERROR!');
            }
          })
          .catch(error => {
            console.error("Erro ao verificar a existência do contratante:", error);
            this.toolboxService.showTooltip('error', 'Ocorreu um erro ao verificar a existência do contratante!', 'Erro!');
          });
      } catch (error) {
        console.error("Ocorreu um erro:", error);
        this.toolboxService.showTooltip('error', 'Ocorreu um erro!', 'Erro!');
      }
    }
  }

  registrarValores(){
    this.optionsEntrada = [];
    this.optionsParcelas = [];
    const porcentagemEntrada = this.formControls?.get('entrada')?.get('porcentagem')?.value ? this.formControls?.get('entrada')?.get('porcentagem')?.value : 0.10;
    const entrada = this.formControls?.get('plano_valor')?.value * porcentagemEntrada;
    let novaEntrada = parseFloat(entrada.toFixed(2));
    

    this.optionsEntrada.push({
      valor: novaEntrada,
      quant: 1,
      viewValue: `Em 1 vez de R$${novaEntrada.toFixed(2)}`
     });

     novaEntrada = novaEntrada / 2;

     this.optionsEntrada.push({
      valor: novaEntrada ,
      quant:2,
      viewValue: `Em 2 vezes de R$${novaEntrada.toFixed(2)}`
     });
 
     const porcentagemParcelas = this.formControls?.get('parcelas')?.get('porcentagem')?.value ? this.formControls?.get('parcelas')?.get('porcentagem')?.value : 0.90;
     const maxParcelas = this.formControls?.get('maxParcelas')?.value ? this.formControls?.get('maxParcelas')?.value : 30;
     const totalParcela = this.formControls?.get('plano_valor')?.value * porcentagemParcelas;
     let novoTotalPacela = parseFloat(totalParcela.toFixed(2));
 
     for(let i = 1; i <= maxParcelas; i++){
       let valor = novoTotalPacela / i;
       this.optionsParcelas.push({
         valor: valor,
         quant: i,
         viewValue: `Em ${i} vez${i > 1 ? 'es' : ' '} de R$${valor.toFixed(2)}`
        });
     }
  }

  pagamentoAvista(event: MatSlideToggleChange) {
    if (event.checked) {
      this.formControls?.get('isAvista')?.setValue(true);
      this.formControls?.get('valorAvista')?.setValue(this.formControls?.get('plano_valor')?.value);

      this.clearValues()
      this.formControls?.get('entrada')?.get('valorTotal')?.setValue(this.formControls?.get('plano_valor')?.value);
    } else {
      this.formControls?.get('isAvista')?.setValue(false);
      this.clearValues()
    }
    this.formularioValido();
  }

  clearValues(){
    this.formControls?.get('parcelas')?.get('quantidade')?.setValue(0);
      this.formControls?.get('parcelas')?.get('valor')?.setValue(0);
      this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(null);
      this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);
      this.formControls?.get('parcelas')?.get('valorTotal')?.setValue(0);
      
      this.formControls?.get('entrada')?.get('quantidade')?.setValue(1);
      this.formControls?.get('entrada')?.get('valor')?.setValue(this.formControls?.get('plano_valor')?.value);
      this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(null);
      this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
      this.formControls?.get('entrada')?.get('valorTotal')?.setValue(this.formControls?.get('plano_valor')?.value);
  }
}