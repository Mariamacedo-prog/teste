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
  user: any = {};
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
    private service: StatusService,
    private  authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.status;
      });

      this.authService.user$.subscribe(user => {
        this.user = user;
      });
    }

 itemId = '';
 view: boolean = false;
 access: any = '';
 databaseInfo: any = {};

 descricaoFormControl = new FormControl("", [Validators.required]);
 empresaIdFormControl = new FormControl("");
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
     this.service.findById(this.itemId).subscribe(status => {
      if(status.empresaId){
        this.empresaIdFormControl.setValue(status.empresaId)
      }
       this.nomeFormControl.setValue(status.nome);
       this.descricaoFormControl.setValue(status.descricao);
     });
   }
 }

 create() {
   const item = {
     "nome":this.nomeFormControl.value,
     "empresaId":this.empresaIdFormControl.value,
     "descricao": this.descricaoFormControl.value,
   }
   
   if(this.user.empresaId){
    item.empresaId = this.user.empresaId;
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
    "empresaId":this.empresaIdFormControl.value,
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
