import { Component } from '@angular/core';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusService } from '../../../services/status.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-status-form',
  templateUrl: './status-form.component.html',
  styleUrl: './status-form.component.css'
})
export class StatusFormComponent {
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
    private service: StatusService) {}

 itemId = '';
 view: boolean = false;
 isLoggedIn: boolean = false;
 databaseInfo: any = {};

 descricaoFormControl = new FormControl("", [Validators.required]);
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
       this.descricaoFormControl.setValue(user.descricao);
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
     "descricao": this.descricaoFormControl.value,
   }
   if(item){
     this.service.save(item);
     this.toolboxService.showTooltip('success', 'Status cadastrado com sucesso!', 'Sucesso!');
     this.router.navigate(['/status/lista']);
   }
 }

 async update(){
   const item = {
    "nome":this.nomeFormControl.value,
    "descricao": this.descricaoFormControl.value,
   }
   this.service.updateItem(this.itemId, item)
 }

 validForm(): boolean {
   return (
       this.descricaoFormControl.valid &&
       this.nomeFormControl.valid 
   );
 }
}
