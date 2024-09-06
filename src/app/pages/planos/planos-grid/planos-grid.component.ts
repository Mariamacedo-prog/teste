import { PlanosService } from './../../../services/planos.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
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
  selector: 'app-planos-grid',
  templateUrl: './planos-grid.component.html',
  styleUrl: './planos-grid.component.css'
})

export class PlanosGridComponent {
  displayedColumns: string[] = ['nome', 'valor', 'entrada', 'desconto', 'numeroParcelas', 'status', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';

  constructor(private router: Router, private toolboxService: ToolboxService,
    private planosService: PlanosService,
    public dialog: MatDialog, private excelService: ExcelService) {}
  ngOnInit(): void {
    this.findAll();
  }


  findAll(){
    this.planosService.getItems().subscribe(planos => {
      if (planos.length >= 0) {
        this.dataSource = planos;
        console.log(planos)
        this.dataSourceFilter = planos;
      }
    });
  }

  addNew() {
    this.router.navigate(["/planos/novo"]);
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((plano: any) => plano.nome.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/planos/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/planos/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir o PLano "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.planosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }

  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 300, object_name: "nome", title: "Nome" },
        { type: "text", width: 100, object_name: "valor", title: "Valor" },
        { type: "text", width: 100, object_name: "formaPagamento", title: "Forma de pagamento" },
        { type: "text", width: 100, object_name: "entrada", title: "Entrada" },
        { type: "text", width: 120, object_name: "numeroParcelas", title: "Número de parcelas" },
        { type: "text", width: 100, object_name: "status", title: "Status" }
    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}
