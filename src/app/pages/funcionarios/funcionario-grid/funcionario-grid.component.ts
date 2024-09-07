import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { FuncionariosService } from '../../../services/funcionarios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { ExcelService } from '../../../services/utils/excel.service';
import { AuthService } from '../../../auth/auth.service';

interface ColumnConfig {
  type: string;
  width: number;
  object_name: string;
  title: string;
}

@Component({
  selector: 'app-funcionario-grid',
  templateUrl: './funcionario-grid.component.html',
  styleUrl: './funcionario-grid.component.css'
})
export class FuncionarioGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private funcionariosService: FuncionariosService,
    public dialog: MatDialog, private excelService: ExcelService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.acesso;
    });
  }

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

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
  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 200, object_name: "nome", title: "Nome do Vendedor" },
        { type: "text", width: 200, object_name: "cpf", title: "CPF do Vendedor" },
        { type: "text", width: 200, object_name: "email", title: "Email do Vendedor" },
        { type: "text", width: 200, object_name: "telefone", title: "Telefone do Vendedor" },
        { type: "text", width: 200, object_name: "rua", title: "Rua do Vendedor" },
        { type: "text", width: 200, object_name: "numero", title: "Numero do Vendedor" },
        { type: "text", width: 200, object_name: "bairro", title: "Bairro do Vendedor" },
        { type: "text", width: 200, object_name: "cidadeUf", title: "Cidade/UF do Vendedor" },
        { type: "text", width: 200, object_name: "cep", title: "CEP do Vendedor" },
        { type: "text", width: 200, object_name: "usuario", title: "Usuario do Vendedor" },
      
    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}