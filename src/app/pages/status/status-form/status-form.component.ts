import { Component } from '@angular/core';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusService } from '../../../services/status.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-status-form',
  templateUrl: './status-form.component.html',
  styleUrl: './status-form.component.css'
})
export class StatusFormComponent {
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
    private service: StatusService,
    private  authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.status;
      });
    }

 itemId = '';
 view: boolean = false;
 access: any = '';
 databaseInfo: any = {};

 descricaoFormControl = new FormControl("", [Validators.required]);
 nomeFormControl = new FormControl('', Validators.required);

 ngOnInit(): void {
  if(this.access == 'restrito'){
    this.router.navigate(["/usuario/lista"]);
  }
  
   this.route.params.subscribe(params => {
      this.itemId = params['id'];

      if(params['tela'] == 'visualizar'){
       this.view = true;
      }
   });

   if(this.itemId){
     this.service.findById(this.itemId).subscribe(user => {
       this.nomeFormControl.setValue(user.nome);
       this.descricaoFormControl.setValue(user.descricao);
     });
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
