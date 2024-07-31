import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ContratosService } from '../../../services/contratos.service';
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
  selector: 'app-contratos-grid',
  templateUrl: './contratos-grid.component.html',
  styleUrl: './contratos-grid.component.css'
})
export class ContratosGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'statusEntrega', 'cartorio', 'vendedor', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';

  cartorios: any = [];
  cartorioSearch: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService,
     private contratosService: ContratosService, private cartoriosService: CartoriosService,
     public dialog: MatDialog, private excelService: ExcelService) {}
  adicionarNovo() {
    this.router.navigate(["/contrato/novo"]);
  }

  ngOnInit(): void {
    this.findAll();

    this.cartoriosService.getItems().subscribe(cartorios => {
      if (cartorios.length >= 0) {
        this.cartorios  = cartorios;
      }
    });
  }
  
  findAll(){
    this.contratosService.getItems().subscribe(contratos => {
      console.log(contratos)
      if (contratos.length >= 0) {
        this.dataSource = contratos;
        this.dataSourceFilter = contratos;
      }
    });
  }

  search() {
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }

    this.dataSourceFilter = this.dataSource.filter((contrato: any) => contrato.contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || contrato.contratante.cpf.includes(this.searchTerm) || (contrato?.vendedor?.nome?.toLowerCase().includes(this.searchTerm.toLowerCase())));
 
    if(this.cartorioSearch != ''){
      this.dataSourceFilter = this.dataSourceFilter.filter((contrato: any) => contrato.cartorio.nome.toLowerCase().includes(this.cartorioSearch.toLowerCase()));
    }
  }

  viewItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Contrato do(a) Contratante "${element.contratante.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contratosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }

  cartorioSelected(event: any){
    const value = event?.value;
    this.cartorioSearch = value;
  }

  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 100, object_name: "numeroContrato", title: "Numero do Contrato" },
        { type: "text", width: 100, object_name: "cartorio.cidadeUf", title: "Cidade do Cartório" },
        { type: "text", width: 200, object_name: "cartorio.nome", title: "Nome do Cartório" },
        { type: "text", width: 100, object_name: "cartorio.cns", title: "CNS do Cartório" },
        { type: "text", width: 300, object_name: "contratante.nome", title: "Nome do Contratante" },
        { type: "text", width: 100, object_name: "contratante.cpf", title: "CPF/CNPJ do Contratante" },
        { type: "text", width: 100, object_name: "contratante.razao_social", title: "Razão social do Contratante" },
        { type: "text", width: 200, object_name: "contratante.email", title: "Email do Contratante" },
        { type: "text", width: 100, object_name: "contratante.estadoCivil", title: "Estado Civil do Contratante" },
        { type: "text", width: 150, object_name: "contratante.telefone", title: "Telefone do Contratante" },
        { type: "text", width: 100, object_name: "contratante.profissao", title: "Profissão do Contratante" },
        { type: "text", width: 100, object_name: "contratante.rg", title: "RG do Contratante" },

        { type: "text", width: 300, object_name: "vendedor.nome", title: "Nome do Vendedor" },
        { type: "text", width: 150, object_name: "vendedor.cidadeUf", title: "Cidade do Vendedor" },
        { type: "text", width: 100, object_name: "vendedor.cpf", title: "CPF do Vendedor" },

        { type: "text", width: 300, object_name: "nucleo.nome", title: "Nome do Núcleo" },
        { type: "text", width: 150, object_name: "nucleo.cidade", title: "Cidade do Núcleo" },
        { type: "text", width: 100, object_name: "nucleo.bairro", title: "Bairro do Núcleo" },
        { type: "text", width: 300, object_name: "nucleo.uf", title: "UF do Núcleo" },
        
        { type: "text", width: 100, object_name: "assinaturaContratada", title: "Assinatura Contratada" },
        { type: "text", width: 100, object_name: "assinaturaContratante", title: "Assinatura Contratante" },
        { type: "text", width: 100, object_name: "assinaturaTesteminha1", title: "Assinatura Testemunha 1" },
        { type: "text", width: 100, object_name: "assinaturaTesteminha2", title: "Assinatura Testemunha 2" },

        
        { type: "text", width: 40, object_name: "id", title: "Id" },
        { type: "text", width: 40, object_name: "imovelId", title: "Id do imóvel" },
    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}
