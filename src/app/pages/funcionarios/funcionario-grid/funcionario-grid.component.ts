import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { FuncionariosService } from '../../../services/funcionarios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-funcionario-grid',
  templateUrl: './funcionario-grid.component.html',
  styleUrl: './funcionario-grid.component.css'
})
export class FuncionarioGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private funcionariosService: FuncionariosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.funcionariosService.getItems().subscribe(funcionarios => {
      if (funcionarios.length >= 0) {
        this.dataSource = funcionarios;
        this.dataSourceFilter = funcionarios;
      }
    });
  }

  addNewFuncionario() {
    this.router.navigate(["/funcionario/novo"]);
  }
  
  search() {
    this.dataSourceFilter = this.dataSource.filter((funcionario: any) => funcionario.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || funcionario.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/funcionario/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/funcionario/form/" + element.id]);
  }

  deleteItem(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Funcionário "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.funcionariosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
}