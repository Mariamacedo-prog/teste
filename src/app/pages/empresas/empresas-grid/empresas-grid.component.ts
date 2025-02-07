import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { CartoriosService } from '../../../services/cartorios.service';
import {  MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { ExcelService } from '../../../services/utils/excel.service';
import { AuthService } from '../../../auth/auth.service';
import { EmpresasService } from '../../../services/empresas.service';


interface ColumnConfig {
  type: string;
  width: number;
  object_name: string;
  title: string;
}

@Component({
  selector: 'app-empresas-grid',
  templateUrl: './empresas-grid.component.html',
  styleUrl: './empresas-grid.component.css'
})
export class EmpresasGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'cnpj', 'companyIdentifier', 'endereco', 'estagio',  'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';

    constructor(private router: Router, private toolboxService: ToolboxService, public dialog: MatDialog,
      private empresasService: EmpresasService, private excelService: ExcelService, private authService: AuthService
    ) {
      this.authService.permissions$.subscribe(perms => {
        this.access = perms.empresas;
      });
    }
    adicionarNovo() {
      this.router.navigate(["/empresas/novo"]);
    }
  
    findAll(){
      if(this.access == 'restrito'){
        this.router.navigate(["/usuario/lista"]);
      }
  
      this.empresasService.getItems().subscribe(empresas => { 
        if (empresas.length >= 0) {
          this.dataSource = empresas;
          this.dataSourceFilter = empresas;
        }
      });
    }
  
    ngOnInit(): void {
      this.findAll();
    }
  
    search() {
      if(this.searchTerm.length == 0){
        this.dataSourceFilter = this.dataSource;
      }
      
      this.dataSourceFilter = this.dataSource.filter((empresa: any) => empresa.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || empresa.cnpj.replace(/\D/g, '').includes(this.searchTerm));
    }
  
    viewItem(element: any){
      this.router.navigate(["/empresas/form/" + element.id + "/visualizar"]);
    }
  
    editItem(element: any){
      this.router.navigate(["/empresas/form/" + element.id]);
    }
  
    deleteItem(element: any){
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        data: {
          text: `Tem certeza que deseja excluir Empresa "${element.nome}"?`,
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.empresasService.deleteItem(element.id);
          this.findAll();
        }
      });
    }
  
    generateExcel(): void {
      const columnsConfig: ColumnConfig[] = [
          { type: "text", width: 200, object_name: "nome", title: "Nome do Contratante" },
          { type: "text", width: 300, object_name: "cpf", title: "CPF do Contratante" },
          { type: "text", width: 300, object_name: "rg", title: "RG do Contratante" },
          { type: "text", width: 300, object_name: "email", title: "Email do Contratante" },
          { type: "text", width: 300, object_name: "telefone", title: "Telefone do Contratante" },
          { type: "text", width: 300, object_name: "nacionalidade", title: "Nacionalidade do Contratante" },
          { type: "text", width: 300, object_name: "profissao", title: "Profissão do Contratante" },
          { type: "text", width: 300, object_name: "estadoCivil", title: "Estado Civil do Contratante" },
          { type: "text", width: 300, object_name: "nomeConjugue", title: "Nome do Conjugê do Contratante" },
          { type: "text", width: 300, object_name: "nacionalidadeConjugue", title: "Nacionalidade do Conjugê do Contratante" },
          { type: "text", width: 300, object_name: "cpfConjuge", title: "CPF do Conjugê do Contratante" },
          
          
          { type: "text", width: 300, object_name: "cartorio.nome", title: "Cartorio" },
  
          { type: "text", width: 300, object_name: "situacao.valoresRecebidos", title: "Valores Recebidos" },
          { type: "text", width: 300, object_name: "situacao.valoresReceber", title: "Valores a Receber" },
          { type: "text", width: 300, object_name: "situacao.situacaoPagamento", title: "Situação do Pagamento" },
  
          
          
      ];
  
      this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
    }
}
