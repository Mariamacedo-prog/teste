import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { CartoriosService } from '../../../services/cartorios.service';
import { ExcelService } from '../../../services/utils/excel.service';
import { ContratosService } from '../../../services/contratos.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { GerenciarDocumentoService } from '../../../services/gerenciarDocumento.service';
import { PdfService } from '../../../services/utils/pdf.service';

@Component({
  selector: 'app-gerenciar-documento-grid',
  templateUrl: './gerenciar-documento-grid.component.html',
  styleUrl: './gerenciar-documento-grid.component.css'
})
export class GerenciarDocumentoGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'cartorio', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  contratoInfo:any = []
  searchTerm: string = '';
  selectedItems:any = [];
  cartorios: any = [];
  cartorioSearch: string = '';
  constructor(private router: Router, private contratosService: ContratosService,private gerenciarDocumentoService: GerenciarDocumentoService, private cartoriosService: CartoriosService,
     public dialog: MatDialog, private authService: AuthService, private pdfService: PdfService
   ) {
     this.authService.permissions$.subscribe(perms => {
       this.access = perms.gerenciar_documento;
     });
   }

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.findAll();

    this.cartoriosService.getItems().subscribe(cartorios => {
      if (cartorios.length >= 0) {
        this.cartorios  = cartorios;
      }
    });
  }
  
  findAll(){
    this.contratosService.getItems().subscribe(contratos => {
      if (contratos.length >= 0) {
        this.dataSource = contratos;
        this.dataSourceFilter = contratos;
      }
    });

    this.gerenciarDocumentoService.getItems().subscribe(info => {
      this.contratoInfo = info
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

  selectItem(input: any, item: any){
   if(input._checked){
    !this.selectedItems.includes(item.id) && this.selectedItems.push(item.id)
   } else {
    let index = this.selectedItems.findIndex((d: any) => d === item.id)
    if(index >= 0){
      this.selectedItems.splice(index, 1);
    }
   }
  }

  allItemsSelected(input: any){
    if(input._checked){
      for(let i of this.dataSourceFilter){
        !this.selectedItems.includes(i.id) && this.selectedItems.push(i.id)
      }
     } else {
      this.selectedItems = []
     }
  }

  download(){
   console.log(this.selectedItems)
   console.log(this.contratoInfo)
   for(let i of this.contratoInfo){
    let base64List = [];

    let anexoContratante = i?.contratante?.anexos;
    if(anexoContratante.cetidaoCasamentoFile.base64){
      base64List.push(anexoContratante.cetidaoCasamentoFile.base64)
    }
    if(anexoContratante.comprovanteAquisicaoImovelFile.base64){
      base64List.push(anexoContratante.comprovanteAquisicaoImovelFile.base64)
    }
    if(anexoContratante.comprovanteEnderecofile.base64){
      base64List.push(anexoContratante.comprovanteEnderecofile.base64)
    }
    if(anexoContratante.cpfConjugueFile.base64){
      base64List.push(anexoContratante.cpfConjugueFile.base64)
    }
    if(anexoContratante.cetidaoCasamentoFile.base64){
      base64List.push(anexoContratante.cetidaoCasamentoFile.base64)
    }
    if(anexoContratante.cpfFile.base64){
      base64List.push(anexoContratante.cpfFile.base64)
    }
    if(anexoContratante.rgConjugueFile.base64){
      base64List.push(anexoContratante.rgConjugueFile.base64)
    }
    if(anexoContratante.rgFile.base64){
      base64List.push(anexoContratante.rgFile.base64)
    }


    this.pdfService.downloadPdfImages(base64List)
   }
  }

  viewItem(element: any){
    this.router.navigate(["/gerenciarDocumento/form/" + element.id + "/visualizar"]);
  }

  cartorioSelected(event: any){
    const value = event?.value;
    this.cartorioSearch = value;
  }
}