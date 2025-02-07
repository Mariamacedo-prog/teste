import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ContratantesService } from '../../../services/contratantes.service';
import { CartoriosService } from '../../../services/cartorios.service';
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
  selector: 'app-contratante-grid',
  templateUrl: './contratante-grid.component.html',
  styleUrl: './contratante-grid.component.css'
})
export class ContratanteGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'estado' ,'situacaoPagamento', 'cartorio','data','valoresReceber','valoresRecebidos', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  cartorios: any = [];
  user: any = {};
  cartorioSearch: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, public dialog: MatDialog,
    private contratantesService: ContratantesService, private cartoriosService: CartoriosService, 
    private excelService: ExcelService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.contratante;
    });
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  adicionarNovo() {
    this.router.navigate(["/contratante/novo"]);
  }

  findAll(){
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }
    if (this.user.empresaPrincipal) {
      this.contratantesService.getItems().subscribe((contratante)=>{
        if (contratante.length >= 0) {
          this.dataSource = contratante;
          this.dataSourceFilter = contratante;
        }
      });
    }else{
      this.contratantesService.getItemsByEmpresaId(this.user.empresaId || '').subscribe((contratante)=>{
        if (contratante.length >= 0) {
          this.dataSource = contratante;
          this.dataSourceFilter = contratante;
        }
      });
    }
  }

  ngOnInit(): void {
    this.findAll();

    if (this.user.empresaPrincipal) {
      this.cartoriosService.getItems().subscribe((cartorios)=>{
        if (cartorios.length >= 0) {
          this.cartorios  = cartorios;
        }
      });
    }else{
      this.cartoriosService.getItemsByEmpresaId(this.user.empresaId || '').subscribe((cartorios)=>{
        if (cartorios.length >= 0) {
          this.cartorios  = cartorios;
        }
      });
    }
  }

  search() {
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
    
    this.dataSourceFilter = this.dataSource.filter((contratante: any) => contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || contratante.cpf.includes(this.searchTerm));
   
    if(this.cartorioSearch !== '') {
      this.dataSourceFilter = this.dataSourceFilter.filter((contratante: any) => {
        if (contratante.cartorio && contratante.cartorio.nome) {
          return contratante.cartorio.nome.toLowerCase().includes(this.cartorioSearch.toLowerCase());
        }
        return false; 
      });
    }
  }

  viewItem(element: any){
    this.router.navigate(["/contratante/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/contratante/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Contratante "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contratantesService.deleteItem(element.id);
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