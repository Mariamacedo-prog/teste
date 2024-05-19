import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-usuario-grid',
  templateUrl: './usuario-grid.component.html',
  styleUrl: './usuario-grid.component.css'
})
export class UsuarioGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private usuariosService: UsuariosService, 
    public dialog: MatDialog) {}
  adicionarNovoUsuario() {
    this.router.navigate(["/usuario/novo"]);
  }


  ngOnInit(): void {
    this.findAllUsers();
  }
  
  findUser() {
    this.dataSourceFilter = this.dataSource.filter((usuario: any) => usuario.nome.includes(this.searchTerm) || usuario.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }
  
  viewItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/usuario/form/" + element.id]);
  }

  findAllUsers(){
    this.usuariosService.getItems().subscribe(usuarios => {
      if (usuarios.length >= 0) {
        this.dataSource = usuarios;
        this.dataSourceFilter = usuarios;
      }
    });
  }

  deleteItem(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Usuário "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.usuariosService.deleteItem(element.id);
        this.findAllUsers();
      }
    });
  }
}