import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcessoService } from '../../../services/acesso.service';
import { MenuService } from '../../../services/menu.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-acesso-form',
  templateUrl: './acesso-form.component.html',
  styleUrl: './acesso-form.component.css'
})
export class AcessoFormComponent implements OnInit{
  id = "";
  view: boolean = false;
  access: any = '';

  databaseInfo: any = {};
  filteredOptions: Observable<string[]> = of([]);
  formControls!: FormGroup;
  telasPermitidas: { tela: string; nivel: any; }[] = [];
  arrayTelas: any = [];

  timeoutId: any;
  filteredNome: any[] = [];
  loadingAcesso: boolean = false;
  acessos: any;
  constructor(private toolboxService: ToolboxService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private service: AcessoService,
    private menuService: MenuService,
    private  authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.acesso;
      });
    }

  permissoesFormControls = this.formBuilder.group({
    acesso: ['restrito', Validators.required],
    cartorio: ['restrito', Validators.required],
    contratante: ['restrito', Validators.required],
    contrato: ['restrito', Validators.required],
    funcionario: ['restrito', Validators.required],
    imovel: ['restrito', Validators.required],
    nucleo: ['restrito', Validators.required],
    plano: ['restrito', Validators.required],
    prefeitura: ['restrito', Validators.required],
    status: ['restrito', Validators.required],
    usuario: ['restrito', Validators.required],
    vendedor: ['restrito', Validators.required],
    gerenciar_documento: ['restrito', Validators.required],
  });


  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.formControls = this.formBuilder.group({
      id: [""],
      createdAt: [null],
      deletedAt: [null],
      nomeGrupo: ["", [Validators.required]],
      status: [true],
      updatedAt: [null],
      permissoes: this.permissoesFormControls
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];

      if(params['tela'] == 'visualizar'){
       this.view = true;
      }
   });

    this.arrayTelas = this.menuService.getMenuItems();
    this.findAcessos();

    if(this.id){
      this.service.findById(this.id).subscribe(item => {
        this.formControls.patchValue({
          id: item.id,
          createdAt: item.createdAt,
          deletedAt: item.deletedAt,
          nomeGrupo: item.nomeGrupo,
          status: item.status,
          updatedAt: item.updatedAt,
          permissoes: item.permissoes
        });
        this.permissoesFormControls.patchValue(item.permissoes);
      });
    }
  } 
  
  findAcessos(){
    this.service.getItems().subscribe((acessos)=>{
      this.acessos = acessos;
      this.formControls?.get('nomeGrupo')?.setValidators([
        this.validateNomeGrupo(this.acessos, this.id), Validators.required
      ]);
    });
  }




  create() {
    if(this.formControls.getRawValue()){
      this.service.save(this.formControls.getRawValue());
      this.toolboxService.showTooltip('success', 'Perfil cadastrado com sucesso!', 'Sucesso!');
      this.router.navigate(['/acesso/lista']);
    }
  }

  async update(){
    if(this.formControls.getRawValue()){
      this.service.updateItem(this.id, this.formControls.getRawValue())
      this.router.navigate(['/acesso/lista']);
    }
  }



  formValid(): boolean {
    return this.formControls.valid;
  }

  handleKeyUp(event: any) {
    this.formControls?.get('nomeGrupo')?.updateValueAndValidity();
  }

  validateNomeGrupo(acessos: any[], id = ""): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (id) {
        if(acessos.some(item => item?.nomeGrupo?.toLowerCase() === value?.toLowerCase() && item?.id != id)){
          return { 'nomeGrupoInvalid': true };
        }
        return null;
      }else{
        if(acessos.some(item => item?.nomeGrupo?.toLowerCase() === value?.toLowerCase())){
          return { 'nomeGrupoInvalid': true };
        }
        return null;
      }
    };
  }
}
