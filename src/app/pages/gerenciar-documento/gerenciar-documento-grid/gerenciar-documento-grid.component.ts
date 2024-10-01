import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartoriosService } from '../../../services/cartorios.service';
import { ContratosService } from '../../../services/contratos.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth/auth.service';
import { GerenciarDocumentoService } from '../../../services/gerenciarDocumento.service';
import { PdfService } from '../../../services/utils/pdf.service';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

 async download(){
    const zip = new JSZip();
    for(let i of this.contratoInfo){
      console.log(this.contratoInfo)
      if(i.contrato.id && this.selectedItems.includes(i.contrato.id)){
        let base64List = [];

        let anexoContratante = i?.contratante?.anexos;
        if(anexoContratante.cetidaoCasamentoFile.base64){
          base64List.push(
            {
              base64: anexoContratante.cetidaoCasamentoFile.base64,
              name: i.contratante.nome + "_certidao_casamento",
              type: anexoContratante.cetidaoCasamentoFile.type,
            }
          )
        }
        if(anexoContratante.comprovanteAquisicaoImovelFile.base64){
          base64List.push(
            {
              base64: anexoContratante.comprovanteAquisicaoImovelFile.base64,
              name: i.contratante.nome + "_comprovante_aquisicao",
              type: anexoContratante.comprovanteAquisicaoImovelFile.type,
            }
          )
        }
        if(anexoContratante.comprovanteEnderecofile.base64){
          base64List.push(
            {
              base64: anexoContratante.comprovanteEnderecofile.base64,
              name: i.contratante.nome + "_comprovante_endereco",
              type: anexoContratante.comprovanteEnderecofile.type,
            }
          )
        }
        if(anexoContratante.cpfConjugueFile.base64){
          base64List.push(
            {
              base64: anexoContratante.cpfConjugueFile.base64,
              name: i.contratante.nome + "_cpf_cônjuge",
              type: anexoContratante.cpfConjugueFile.type,
            }
          )
        }
        if(anexoContratante.cetidaoCasamentoFile.base64){
          base64List.push(
            {
              base64: anexoContratante.cetidaoCasamentoFile.base64,
              name: i.contratante.nome + "_certidao_casamento",
              type: anexoContratante.cetidaoCasamentoFile.type,
            }
          )
        }
        if(anexoContratante.cpfFile.base64){
          base64List.push(
            {
              base64: anexoContratante.cpfFile.base64,
              name: i.contratante.nome + "_cpf",
              type: anexoContratante.cpfFile.type,
            }
          )
        }
        if(anexoContratante.rgConjugueFile.base64){
          base64List.push(
            {
              base64: anexoContratante.rgConjugueFile.base64,
              name: i.contratante.nome + "_cpf_cônjuge",
              type: anexoContratante.rgConjugueFile.type,
            }
          )
        }
        if(anexoContratante.rgFile.base64){
          base64List.push(
            {
              base64: anexoContratante.rgFile.base64,
              name: i.contratante.nome + "_rg",
              type: anexoContratante.rgFile.type,
            }
          )
        }
        if(i?.imovel?.fotos){
          base64List.push(
            {
              base64: i?.imovel?.fotos?.base64,
              name: i.contratante.nome + "_imovel_foto",
              type: i?.imovel?.fotos?.type,
            }
          )
        }
  
        if(base64List.length > 0){
          const pdfBlob = await this.pdfService.downloadPdfImages(base64List)
          zip.file(`${i.contratante.nome.replaceAll(" ", "_") + '_' + (i?.contrato?.numeroContrato ? i?.contrato?.numeroContrato : i?.imovel?.enderecoPorta?.rua?.replaceAll(" ", "_"))}.pdf`, pdfBlob, { binary: true });
        }

        const pdfFiles = base64List.filter(item => item.type === 'pdf');
        for (let pdfFile of pdfFiles) {
            const pdfBlob = this.pdfService.convertBase64ToPDF(pdfFile.base64);
            zip.file(`${pdfFile.name.replaceAll(" ", "_") + '_' + (i?.contrato?.numeroContrato ? i?.contrato?.numeroContrato : i?.imovel?.enderecoPorta?.rua?.replaceAll(" ", "_"))}.pdf`, pdfBlob, { binary: true });
        }
      }
    }

    // Generate the ZIP file and download
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "documentos.zip");
    });
  }

  viewItem(element: any){
    this.router.navigate(["/gerenciarDocumento/form/" + element.id + "/visualizar"]);
  }

  cartorioSelected(event: any){
    const value = event?.value;
    this.cartorioSearch = value;
  }
}