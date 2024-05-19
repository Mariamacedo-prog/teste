import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolboxService } from '../toolbox/toolbox.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import {DateAdapter } from '@angular/material/core';
import { VendasPagamentosService } from '../../services/vendasPagamentos.service';
import { map } from 'rxjs';



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
  value: number;
  quant: number;
  viewValue: string;
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
  planos: TypeSelectValue[] = [
    {value: 6000, quant: 1, viewValue: 'Valor: R$6.000,00 - Por imóvel de habitação'},
    {value: 6000, quant: 1, viewValue: 'Valor: R$6.000,00 – Loteamento Lagos de San José'},
    {value: 6000, quant: 1, viewValue: 'Valor: R$6.000,00 –  Associação recreativa Canto dos Pássaros'},
    {value: 10000, quant: 1 ,viewValue: 'Valor: R$10.000,00 - Comercio'},
    {value: 12000, quant: 1 ,viewValue: 'Valor: R$12.000,00 - Indústria'},
    {value: 600, quant: 1, viewValue: 'Valor: R$600,00'},
  ];
  formControls!: FormGroup;
  optionsEntrada: TypeSelectValue[] = [];
  optionsParcelas: TypeSelectValue[] = [];
  minDate: Date = new Date();
  panelOpenState:boolean = false;
  databaseInfo: any = {};
  existeParcelamento:boolean = false;
  @Input() dataContratanteInfo: any;

  @Input() dataImovelInfo: any;

  @Output() dataEvent = new EventEmitter<any>();

  constructor(private toolboxService: ToolboxService, private formBuilder: FormBuilder, 
   private vendasPagamentosService: VendasPagamentosService) {}


  entradaFormControls = this.formBuilder.group({
    quantidade: [0, this.formControls?.get('isAvista')?.value == true ? null : Validators.required],
    valor: [0, this.formControls?.get('isAvista')?.value == true? null : Validators.required],
    dataPrimeiroPagamento: [null, this.formControls?.get('isAvista')?.value == true? null : Validators.required],
    dataUltimoPagamento: [null],
    valorTotal:[0]
  });

  parcelasFormControls = this.formBuilder.group({
    quantidade: [0, this.formControls?.get('isAvista')?.value == true? null : Validators.required],
    valor: [0, this.formControls?.get('isAvista')?.value == true ? null : Validators.required],
    dataPrimeiroPagamento: [null, this.formControls?.get('isAvista')?.value == true ? null : Validators.required],
    dataUltimoPagamento: [null],
    valorTotal:[0, this.formControls?.get('isAvista')?.value == true ? null : Validators.required]
  });
  

  ngOnInit(): void {   
    this.formControls = this.formBuilder.group({
      id: [0],
      idImovel: [''],
      plano: [null, Validators.required],
      entrada: this.entradaFormControls,
      parcelas: this.parcelasFormControls,
      isAvista: false,
      valorAvista: [null, Validators.required],
    });
    

    this.verificarContratante();

    this.calculateDataFinalEntrada();
  }

   verificarContratante() {
    this.vendasPagamentosService.getItems().subscribe((vendas)=>{
      if(vendas.length >= 0){
        for(let venda of vendas){
        
          if(venda.contratante.id == this.dataContratanteInfo.id && venda.idImovel == this.dataImovelInfo) {
            this.formControls?.get('plano')?.setValue(venda.plano);
            this.registarValores();
            this.formControls?.get('id')?.setValue(venda.id);
            this.formControls?.get('isAvista')?.setValue(venda.isAvista);
            this.formControls?.get('valorAvista')?.setValue(venda.valorAvista);
            this.formControls?.get('idImovel')?.setValue(venda.idImovel);
    
            this.formControls?.get('parcelas')?.get('quantidade')?.setValue(venda?.parcelas?.quantidade);
            this.formControls?.get('parcelas')?.get('valor')?.setValue(venda?.parcelas?.valor);
            this.formControls?.get('parcelas')?.get('valorTotal')?.setValue(venda?.parcelas?.valorTotal);
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
      this.optionsEntrada = [];
      this.formControls?.get('plano')?.setValue(value);
      const valorAvista = value;
  
      this.formControls?.get('valorAvista')?.setValue(valorAvista);
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

    const entrada = this.formControls?.get('plano')?.value * 0.10;
    let novaEntrada = parseFloat(entrada.toFixed(2));
    

    this.optionsEntrada.push({
      value: novaEntrada,
      quant: 1,
      viewValue: `Em 1 vez de R$${novaEntrada.toFixed(2)}`
     });

     novaEntrada = novaEntrada / 2;

     this.optionsEntrada.push({
      value: novaEntrada ,
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
        const entradaX = this.optionsEntrada.find(item => item.value === value);
        if(entradaX){
          this.formControls?.get('entrada')?.get('valor')?.setValue(entradaX.value);
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
    const totalParcela = this.formControls?.get('plano')?.value * 0.90;
    let novoTotalPacela = parseFloat(totalParcela.toFixed(2));

    for(let i = 1; i <= 30; i++){
      let valor = novoTotalPacela / i;
      this.optionsParcelas.push({
        value: valor,
        quant: i,
        viewValue: `Em ${i} vez${i > 1 ? 'es' : ' '} de R$${valor.toFixed(2)}`
       });
    }
    
  }

  changeParcela(event: any){
    const value = event?.value; // Acessa o valor selecionado do evento
    if(value){
        const parcelax = this.optionsParcelas.find(item => item.value === value);
        if(parcelax){
          this.formControls?.get('parcelas')?.get('valor')?.setValue(parcelax.value);
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

  registarValores(){
    this.optionsEntrada = [];
    this.optionsParcelas = [];
    const entrada = this.formControls?.get('plano')?.value * 0.10;
    let novaEntrada = parseFloat(entrada.toFixed(2));
    

    this.optionsEntrada.push({
      value: novaEntrada,
      quant: 1,
      viewValue: `Em 1 vez de R$${novaEntrada.toFixed(2)}`
     });

     novaEntrada = novaEntrada / 2;

     this.optionsEntrada.push({
      value: novaEntrada ,
      quant:2,
      viewValue: `Em 2 vezes de R$${novaEntrada.toFixed(2)}`
     });
 
     const totalParcela = this.formControls?.get('plano')?.value * 0.90;
     let novoTotalPacela = parseFloat(totalParcela.toFixed(2));
 
     for(let i = 1; i <= 30; i++){
       let valor = novoTotalPacela / i;
       this.optionsParcelas.push({
         value: valor,
         quant: i,
         viewValue: `Em ${i} vez${i > 1 ? 'es' : ' '} de R$${valor.toFixed(2)}`
        });
     }
  }

  pagamentoAvista(event: MatSlideToggleChange) {
    if (event.checked) {
      this.formControls?.get('isAvista')?.setValue(true);
      this.formControls?.get('valorAvista')?.setValue(this.formControls?.get('plano')?.value);

      this.clearValues()
      this.formControls?.get('entrada')?.get('valorTotal')?.setValue(this.formControls?.get('plano')?.value);
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
      this.formControls?.get('entrada')?.get('valor')?.setValue(this.formControls?.get('plano')?.value);
      this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(null);
      this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
      this.formControls?.get('entrada')?.get('valorTotal')?.setValue(this.formControls?.get('plano')?.value);
  }
}
