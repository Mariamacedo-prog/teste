import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImoveisService } from '../../../services/imoveis.service';
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
  selector: 'app-imovel-grid',
  templateUrl: './imovel-grid.component.html',
  styleUrl: './imovel-grid.component.css'
})
export class ImovelGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade',  'nucleo', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private imoveisService: ImoveisService, public dialog: MatDialog, private excelService: ExcelService) {}
  addNew() {
    this.router.navigate(["/imovel/novo"]);
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.imoveisService.getItems().subscribe(imoveis => {
      if (imoveis.length >= 0) {
        this.dataSource = imoveis;
        this.dataSourceFilter = imoveis;
      }
    });
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((imovel: any) => imovel.contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || imovel.contratante.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Imóvel do(a) Contratante "${element.contratante.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.imoveisService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 290, object_name: "contratante.nome", title: "Nome do Contratante" },
        { type: "text", width: 100, object_name: "contratante.cpf", title: "CPF do Contratante" },

       
        { type: "text", width: 300, object_name: "enderecoPorta.rua", title: "Rua Endereço de Porta" },
        { type: "text", width: 200, object_name: "enderecoPorta.numero", title: "Numero Endereço de Porta" },
        { type: "text", width: 200, object_name: "enderecoPorta.bairro", title: "Bairro Endereço de Porta" },
        { type: "text", width: 200, object_name: "enderecoPorta.cidadeUf", title: "Cidade/UF Endereço de Porta" },
        { type: "text", width: 120, object_name: "enderecoPorta.cep", title: "CEP Endereço de Porta" },
        { type: "text", width: 200, object_name: "enderecoPorta.nulecoInformal", title: "Nucleo Informal Endereço de Porta" },
        { type: "text", width: 150, object_name: "enderecoPorta.iptu", title: "IPTU Endereço de Porta" },


        { type: "text", width: 300, object_name: "enderecoProjeto.rua", title: "Rua Endereço de Projeto" },
        { type: "text", width: 200, object_name: "enderecoProjeto.numero", title: "Numero Endereço de Projeto" },
        { type: "text", width: 200, object_name: "enderecoProjeto.bairro", title: "Bairro Endereço de Projeto" },
        { type: "text", width: 200, object_name: "enderecoProjeto.cidadeUf", title: "Cidade/UF Endereço de Projeto" },
        { type: "text", width: 120, object_name: "enderecoProjeto.cep", title: "CEP Endereço de Projeto" },
        { type: "text", width: 200, object_name: "enderecoProjeto.nucleoInformalProjeto", title: "Nucleo Informal Endereço de Projeto" },
        { type: "text", width: 150, object_name: "enderecoProjeto.quadra", title: "Quadra Endereço de Projeto" },
        { type: "text", width: 150, object_name: "enderecoProjeto.lote", title: "Lote Endereço de Projeto" },

        { type: "text", width: 300, object_name: "enderecoDefinitivo.rua", title: "Rua Endereço Definitivo" },
        { type: "text", width: 200, object_name: "enderecoDefinitivo.numero", title: "Numero Endereço Definitivo" },
        { type: "text", width: 200, object_name: "enderecoDefinitivo.bairro", title: "Bairro Endereço Definitivo" },
        { type: "text", width: 200, object_name: "enderecoDefinitivo.cidadeUf", title: "Cidade/UF Endereço Definitivo" },
        { type: "text", width: 120, object_name: "enderecoDefinitivo.cep", title: "CEP Endereço Definitivo" },
        { type: "text", width: 200, object_name: "enderecoDefinitivo.nucleoInformalDefinitivo", title: "Nucleo Informal Endereço Definitivo" },
        { type: "text", width: 150, object_name: "enderecoDefinitivo.matricula", title: "Matricula Endereço Definitivo" },
        

    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}