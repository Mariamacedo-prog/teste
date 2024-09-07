import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrefeiturasService } from '../../../services/prefeituras.service';
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
  selector: 'app-prefeitura-grid',
  templateUrl: './prefeitura-grid.component.html',
  styleUrl: './prefeitura-grid.component.css'
})
export class PrefeituraGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'cnpj', 'cargo', 'cidade', 'email', 'telefone', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private prefeiturasService: PrefeiturasService, 
    public dialog: MatDialog, 
    private excelService: ExcelService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.acesso;
    });
  }

  adicionarNovaPrefeitura() {
    this.router.navigate(["/prefeitura/nova"]);
  }

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.findAll();
  }

  findAll(){
    this.prefeiturasService.getItems().subscribe(prefeituras => {
      if (prefeituras.length >= 0) {
        this.dataSource = prefeituras;
        this.dataSourceFilter = prefeituras;
      }
    });
  }


  search() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.prefeitura.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.prefeitura.cnpj.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/prefeitura/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/prefeitura/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Prefeitura "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.prefeiturasService.deleteItem(element.id);
        this.findAll();
      }
    });
  }

  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 300, object_name: "nome", title: "Nome" },
        { type: "text", width: 110, object_name: "cnpj", title: "CNPJ" },
        { type: "text", width: 110, object_name: "telefone", title: "Telefone" },
        { type: "text", width: 160, object_name: "email", title: "E-Mail" },

        { type: "text", width: 300, object_name: "representante.nome", title: "Nome do Representante" },
        { type: "text", width: 100, object_name: "representante.nacionalidade", title: "Nacionalidade do representante" },
        { type: "text", width: 110, object_name: "representante.cpf", title: "CPF do representante" },
        { type: "text", width: 100, object_name: "representante.rg", title: "RG do representante" },

        { type: "text", width: 200, object_name: "responsavel.nome", title: "Nome do responsável" },
        { type: "text", width: 100, object_name: "responsavel.cargo", title: "Cargo do responsável" },

        { type: "text", width: 200, object_name: "endereco.rua", title: "Rua" },
        { type: "text", width: 100, object_name: "endereco.cep", title: "Cep" },
        { type: "text", width: 150, object_name: "endereco.bairro", title: "Bairro" },
        { type: "text", width: 80, object_name: "endereco.cidadeUf", title: "UF" },
        { type: "text", width: 100, object_name: "endereco.complemento", title: "Complemento" },
        { type: "text", width: 80, object_name: "endereco.numero", title: "Número" },
    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}
