import { Component } from '@angular/core';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NucleoService } from '../../../services/nucleo.service';
import { FormControl, Validators } from '@angular/forms';
import { CepService } from '../../../services/utils/cep.service';
import { PlanosService } from '../../../services/planos.service';

@Component({
  selector: 'app-nucleos-form',
  templateUrl: './nucleos-form.component.html',
  styleUrl: './nucleos-form.component.css'
})
export class NucleosFormComponent {
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
    private service: NucleoService, private planoService: PlanosService, private cepService: CepService,) {}
    
   

  itemId = '';
  view: boolean = false;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};

  cepFormControl = new FormControl('');

  planosList: any[]= [];

  bairroFormControl = new FormControl('', [Validators.required]);
  cidadeFormControl = new FormControl('', [Validators.required]);
  ufFormControl = new FormControl('', [Validators.required]);
  planosFormControl = new FormControl('');
  nomeFormControl = new FormControl('', Validators.required);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.itemId = params['id'];
        
        if(params['tela'] == 'visualizar'){
        this.view = true;
        }
    });

    this.isAuthenticated();

    if(this.itemId){
      this.service.findById(this.itemId).subscribe(user => {
        this.nomeFormControl.setValue(user.nome);
        this.bairroFormControl.setValue(user.bairro);
        this.cidadeFormControl.setValue(user.cidade);
        this.ufFormControl.setValue(user.uf);
        this.planosFormControl.setValue(user.planos);
      });
    }

    this.planoService.getActiveItems().subscribe(planos => {
      if (planos.length >= 0) {
        this.planosList = planos;
      }
    });
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
      "bairro":this.bairroFormControl.value,
      "cidade":this.cidadeFormControl.value,
      "uf":this.ufFormControl.value,
      "planos": this.planosFormControl.value,
    }
    if(item){
      this.service.save(item);
      this.toolboxService.showTooltip('success', 'Status cadastrado com sucesso!', 'Sucesso!');
      this.router.navigate(['/nucleos/lista']);
    }
  }

  async update(){
    const item = {
      "nome":this.nomeFormControl.value,
      "bairro":this.bairroFormControl.value,
      "cidade":this.cidadeFormControl.value,
      "uf":this.ufFormControl.value,
      "planos": this.planosFormControl.value,
    }
    this.service.updateItem(this.itemId, item)
  }

  validForm(): boolean {
    return (
        this.bairroFormControl.valid &&
        this.nomeFormControl.valid &&
        this.cidadeFormControl.valid &&
        this.planosFormControl.valid &&
        this.ufFormControl.valid
    );
  }

  cleanAddress(){
    this.ufFormControl.setValue('');
    this.bairroFormControl.setValue('');
    this.cidadeFormControl.setValue('');
  }

  findAddress() {
    if(this.cepFormControl.value){
      this.cleanAddress();

      if (this.cepFormControl.value.toString().length === 8) {
        this.cepService.getAddressByCep(this.cepFormControl.value)
          .subscribe(
            data => {
              if(!data.erro){
                this.bairroFormControl.setValue(data.bairro);
                this.cidadeFormControl.setValue(data.localidade)
                this.ufFormControl.setValue(data.uf)
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
}
