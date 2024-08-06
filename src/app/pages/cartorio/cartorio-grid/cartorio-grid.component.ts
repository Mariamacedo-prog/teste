import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { CartoriosService } from '../../../services/cartorios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { ExcelService } from '../../../services/utils/excel.service';

interface ColumnConfig {
  type: string;
  width: number;
  object_name: string;
  title: string;
}

@Component({
  selector: 'app-cartorio-grid',
  templateUrl: './cartorio-grid.component.html',
  styleUrl: './cartorio-grid.component.css'
})
export class CartorioGridComponent {
  displayedColumns: string[] = ['nome', 'cnpj', 'cns', 'cargo', 'cidade', 'email', 'telefone', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService,
    public dialog: MatDialog,private cartoriosService: CartoriosService, private excelService: ExcelService) {}
  newCartorio() {
    this.router.navigate(["/cartorio/novo"]);
  }

  ngOnInit(): void {
   this.findAll();
  }

  findAll(){
    this.cartoriosService.getItems().subscribe(catorios => {
      if (catorios.length >= 0) {
        this.dataSource = catorios;
        this.dataSourceFilter = catorios;
      }
    });
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.cnpj.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Cartorio "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cartoriosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 300, object_name: "nome", title: "Nome" },
        { type: "text", width: 110, object_name: "cnpj", title: "CNPJ" },
        { type: "text", width: 100, object_name: "telefone", title: "Telefone" },
        { type: "text", width: 200, object_name: "email", title: "E-Mail" },

        { type: "text", width: 300, object_name: "representante.nome", title: "Nome do Representante" },
        { type: "text", width: 100, object_name: "representante.nacionalidade", title: "Nacionalidade do representante" },
        { type: "text", width: 110, object_name: "representante.cpf", title: "CPF do representante" },
        { type: "text", width: 100, object_name: "representante.rg", title: "RG do representante" },

        { type: "text", width: 300, object_name: "responsavel.nome", title: "Nome do responsável" },
        { type: "text", width: 100, object_name: "responsavel.cargo", title: "Cargo do responsável" },

        { type: "text", width: 300, object_name: "endereco.rua", title: "Rua" },
        { type: "text", width: 100, object_name: "endereco.cep", title: "Cep" },
        { type: "text", width: 200, object_name: "endereco.bairro", title: "Bairro" },
        { type: "text", width: 100, object_name: "endereco.cidadeUf", title: "UF" },
        { type: "text", width: 150, object_name: "endereco.complemento", title: "Complemento" },
        { type: "text", width: 100, object_name: "endereco.numero", title: "Número" },
    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}
