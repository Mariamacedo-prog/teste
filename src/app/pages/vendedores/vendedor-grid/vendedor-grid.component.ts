import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { VendedoresService } from '../../../services/vendedores.service';
import {  MatDialog } from '@angular/material/dialog';
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
  selector: 'app-vendedor-grid',
  templateUrl: './vendedor-grid.component.html',
  styleUrl: './vendedor-grid.component.css'
})
export class VendedorGridComponent {
  access: any = '';
  displayedColumns: string[] = ['foto','nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private vendedoresService: VendedoresService,
    public dialog: MatDialog, private excelService: ExcelService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.vendedor;
    });
  }
 
  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.findAll();
  }
  
  findAll(){
    this.vendedoresService.getItems().subscribe(vendedores => {
      if (vendedores.length >= 0) {
        this.dataSource = vendedores;
        this.dataSourceFilter = vendedores;
      }
    });
  }

  addNewVendedor() {
    this.router.navigate(["/vendedor/novo"]);
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((vendedor: any) => vendedor.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || vendedor.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Vendedor "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendedoresService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 200, object_name: "nome", title: "Nome do Vendedor" },
        { type: "text", width: 100, object_name: "cpf", title: "CPF do Vendedor" },
        { type: "text", width: 110, object_name: "telefone", title: "Telefone do Vendedor" },
        { type: "text", width: 300, object_name: "email", title: "Email do Vendedor" },
        { type: "text", width: 100, object_name: "rg", title: "RG do Vendedor" },
        { type: "text", width: 210, object_name: "rua", title: "Rua do Vendedor" },
        { type: "text", width: 200, object_name: "numero", title: "Numero do Vendedor" },
        { type: "text", width: 100, object_name: "bairro", title: "Bairro do Vendedor" },
        { type: "text", width: 150, object_name: "cidadeUf", title: "Cidade do Vendedor " },
        { type: "text", width: 100, object_name: "cep", title: "CEP do Vendedor " },
       
    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}
