import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { AcessoService } from '../../../services/acesso.service';
import { AuthService } from '../../../auth/auth.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-acesso-grid',
  templateUrl: './acesso-grid.component.html',
  styleUrl: './acesso-grid.component.css'
})
export class AcessoGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'status','actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  user: any = {};

  constructor(private router: Router, 
    public dialog: MatDialog,
    private service: AcessoService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.acesso;
    });
    
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

 
  ngOnInit(): void {
    this.findAll();
  };

  findAll(){
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    if (this.user.empresaPrincipal) {
      this.service.getItems().subscribe((items)=>{
        if (items.length >= 0) {
          this.dataSource = items;
          this.dataSourceFilter = items;
        }
      });
    }else{
      this.service.getItemsByEmpresaId(this.user.empresaId || '').subscribe((items)=>{
        if (items.length >= 0) {
          this.dataSource = items;
          this.dataSourceFilter = items;
        }
      });
    }
  }

  adicionarNovo() {
    this.router.navigate(["/acesso/novo"]);
  }
  
  procurar() {
    this.dataSourceFilter = this.dataSource.filter((acesso: any) => acesso.nomeGrupo.toLowerCase().includes(this.searchTerm.toLowerCase()) );
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  adicionarNovoGrupo() {
    this.router.navigate(["/acesso/novo"]);
  }
  

  visualizarItem(element: any){
    this.router.navigate(["/acesso/form/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/acesso/form/" + element.id]);
  }

  deletarItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Cartorio "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.service.deleteItem(element.id);
        this.findAll();
      }
    });
  }
}
