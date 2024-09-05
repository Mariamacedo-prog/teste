import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { PlanosService } from '../../../services/planos.service';
@Component({
  selector: 'app-planos-form',
  templateUrl: './planos-form.component.html',
  styleUrl: './planos-form.component.css'
})
export class PlanosFormComponent {

  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
     private planosService: PlanosService) {}

  planoId = '';
  view: boolean = false;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};

  valorFormControl = new FormControl(0, [Validators.required]);
  nomeFormControl = new FormControl('', Validators.required);
  formaPagamentoFormControl = new FormControl('', [Validators.required]);
  entradaFormControl = new FormControl('', [Validators.required]);
  numeroParcelasFormControl = new FormControl('', [Validators.required]);
  statusFormControl = new FormControl(false, [Validators.required]);
  descontoFormControl = new FormControl(null);
  percentageOptions = [
    { value: 5, label: '5%' },
    { value: 10, label: '10%' },
    { value: 15, label: '15%' },
    { value: 20, label: '20%' },
    { value: 25, label: '25%' },
    { value: 30, label: '30%' },
    { value: 35, label: '35%' },
    { value: 40, label: '40%' },
    { value: 45, label: '45%' },
    { value: 50, label: '50%' },
    { value: 55, label: '55%' },
    { value: 60, label: '60%' },
    { value: 65, label: '65%' },
    { value: 70, label: '70%' },
    { value: 75, label: '75%' },
    { value: 80, label: '80%' },
    { value: 85, label: '85%' },
    { value: 90, label: '90%' },
    { value: 95, label: '95%' },
  ];


  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.planoId = params['id'];
       
       if(params['tela'] == 'visualizar'){
        this.view = true;
       }
    });

    this.isAuthenticated();

    if(this.planoId){
      this.planosService.findById(this.planoId).subscribe(user => {
        this.valorFormControl.setValue(user.valor);
        this.nomeFormControl.setValue(user.nome);
        this.formaPagamentoFormControl.setValue(user.formaPagamento);
        this.entradaFormControl.setValue(user.entrada);
        this.numeroParcelasFormControl.setValue(user.numeroParcelas);
        this.statusFormControl.setValue(user.status);
        if(user.desconto){
          this.descontoFormControl.setValue(user.desconto);
        }
      });
    }
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
  }

  create() {
    const item = {
      "nome":this.nomeFormControl.value,
      "valor": this.valorFormControl.value,
      "formaPagamento": this.formaPagamentoFormControl.value,
      "entrada": this.entradaFormControl.value,
      "numeroParcelas": this.numeroParcelasFormControl.value,
      "status": this.statusFormControl.value,
      "desconto": this.descontoFormControl.value
    }
    if(item){
      this.planosService.save(item);
      this.toolboxService.showTooltip('success', 'Plano realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/planos/lista']);
    }
  }

  async update(){
    const item = {
      "nome":this.nomeFormControl.value,
      "valor": this.valorFormControl.value,
      "formaPagamento": this.formaPagamentoFormControl.value,
      "entrada": this.entradaFormControl.value,
      "numeroParcelas": this.numeroParcelasFormControl.value,
      "status": this.statusFormControl.value,
      "desconto": this.descontoFormControl.value
    }
    this.planosService.updateItem(this.planoId, item)
  }

  validForm(): boolean {
    return (
        this.valorFormControl.valid &&
        this.nomeFormControl.valid &&
        this.formaPagamentoFormControl.valid &&
        this.entradaFormControl.valid &&
        this.numeroParcelasFormControl.valid &&
        this.statusFormControl.valid 
    );
  }

  formaPagamentoSelected(event: any){
    const value = event?.value;
    if(value.length == 0){
      this.entradaFormControl.invalid
    }else{
      this.formaPagamentoFormControl.setValue(value);
    }
  }
}
