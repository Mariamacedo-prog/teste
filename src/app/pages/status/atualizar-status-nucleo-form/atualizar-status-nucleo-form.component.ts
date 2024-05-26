import { Component } from '@angular/core';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

import { ActivatedRoute, Router } from '@angular/router';
import { StatusService } from '../../../services/status.service';
import { FormControl, Validators } from '@angular/forms';
import { NucleoService } from '../../../services/nucleo.service';
import { ContratosService } from '../../../services/contratos.service';

@Component({
  selector: 'app-atualizar-status-nucleo-form',
  templateUrl: './atualizar-status-nucleo-form.component.html',
  styleUrl: './atualizar-status-nucleo-form.component.css'
})
export class AtualizarStatusNucleoFormComponent {
  constructor(private router: Router, private route: ActivatedRoute,
    private service: StatusService, private statusService: StatusService, private nucleoService: NucleoService, private contratosService: ContratosService) {}

 itemId = '';
 view: boolean = false;
 isLoggedIn: boolean = false;
 databaseInfo: any = {};
 timeoutId: any;

 status: any[] = [];

 nucleos: any[] = [];
 filteredNucleos: any[] = [];
 loadingNucleo: boolean = false;

 nucleoFormControl = new FormControl({}, [Validators.required]);
 nucleoNomeFormControl = new FormControl("", [Validators.required]);
 statusFormControl = new FormControl("", Validators.required);

 ngOnInit(): void {
  this.isAuthenticated();
  this.findStatus();
  this.findNucleos();
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

 isAuthenticated(){
   if(localStorage.getItem('isLoggedIn') == 'true'){
     this.isLoggedIn = true;
   }else{
     this.isLoggedIn = false;
   }
 }

 
 handleKeyUpNucleo(event: any) {
  this.loadingNucleo = true;
  clearTimeout(this.timeoutId); 
  const nome = event.target.value.trim();
  if (nome.length >= 3) {
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
  this.nucleoNomeFormControl?.setValue(item.nome);
  this.nucleoFormControl?.setValue(item);
  this.loadingNucleo = false;
}


 async update(){
  await this.contratosService.updateAllStatusByNucleo(this.nucleoFormControl.value, this.statusFormControl.value)
 }

 validForm(): boolean {
   return (
       this.nucleoNomeFormControl.valid &&
       this.statusFormControl.valid 
   );
 }
}
