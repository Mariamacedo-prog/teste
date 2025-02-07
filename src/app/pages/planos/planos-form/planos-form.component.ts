import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { PlanosService } from '../../../services/planos.service';
import { AuthService } from '../../../auth/auth.service';
@Component({
  selector: 'app-planos-form',
  templateUrl: './planos-form.component.html',
  styleUrl: './planos-form.component.css'
})
export class PlanosFormComponent {
  user: any = {};
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
     private planosService: PlanosService,
     private  authService: AuthService
     ) {
       this.authService.permissions$.subscribe(perms => {
         this.access = perms.plano;
       });
       
      this.authService.user$.subscribe(user => {
        this.user = user;
      });
     }
 
     access: any = '';
  planoId = '';
  view: boolean = false;
  databaseInfo: any = {};

  valorFormControl = new FormControl(0, [Validators.required]);
  nomeFormControl = new FormControl('', Validators.required);
  formaPagamentoFormControl = new FormControl('', [Validators.required]);
  entradaFormControl = new FormControl('', [Validators.required]);
  numeroParcelasFormControl = new FormControl('', [Validators.required]);
  statusFormControl = new FormControl(false, [Validators.required]);
  descontoFormControl = new FormControl(null);
  empresaIdFormControl = new FormControl('');
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
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.route.params.subscribe(params => {
       this.planoId = params['id'];
       
       if(params['tela'] == 'visualizar'){
        this.view = true;
       }
    });

    if(this.planoId){
      this.planosService.findById(this.planoId).subscribe(plano => {
        this.valorFormControl.setValue(plano.valor);
        this.nomeFormControl.setValue(plano.nome);
        this.formaPagamentoFormControl.setValue(plano.formaPagamento);
        this.entradaFormControl.setValue(plano.entrada);
        this.numeroParcelasFormControl.setValue(plano.numeroParcelas);
        this.statusFormControl.setValue(plano.status);
        if(plano.empresaId){
          this.empresaIdFormControl.setValue(plano.empresaId);
        }

        if(plano.desconto){
          this.descontoFormControl.setValue(plano.desconto);
        }
      });
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
      "desconto": this.descontoFormControl.value,
      "empresaId": this.empresaIdFormControl.value
    }
    if(item){
      if(this.user.empresaId){
        item.empresaId = this.user.empresaId;
      }

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
      "desconto": this.descontoFormControl.value,
      "empresaId": this.empresaIdFormControl.value
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
