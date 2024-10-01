import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GerenciarDocumentoService } from '../../../services/gerenciarDocumento.service';
import { AuthService } from '../../../auth/auth.service';
import { PdfService } from '../../../services/utils/pdf.service';

@Component({
  selector: 'app-gerenciar-documento-form',
  templateUrl: './gerenciar-documento-form.component.html',
  styleUrl: './gerenciar-documento-form.component.css'
})
export class GerenciarDocumentoFormComponent {
  access: any = '';
  id = '';
  data:any = [];
  datainfo:any = {};
  visualizar: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private gerenciarDocumentoService: GerenciarDocumentoService, private authService: AuthService, private pdfService: PdfService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.gerenciar_documento;
    });
  }

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.route.params.subscribe(params => {
       this.id = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.findItem();
  }

  findItem(){
    this.gerenciarDocumentoService.getById(this.id).subscribe(contrato => {
      if(contrato[0]){
          this.datainfo = contrato[0]
          console.log(contrato[0])
          let base64List = [];
          let anexoContratante = contrato[0]?.contratante?.anexos;
          if(anexoContratante.cetidaoCasamentoFile.base64){
            base64List.push(
              {
                base64: anexoContratante.cetidaoCasamentoFile.base64,
                name: contrato[0].contratante.nome + "_certidao_casamento",
                type: anexoContratante.cetidaoCasamentoFile.type,
              }
            )
          }
          if(anexoContratante.comprovanteAquisicaoImovelFile.base64){
            base64List.push(
              {
                base64: anexoContratante.comprovanteAquisicaoImovelFile.base64,
                name: contrato[0].contratante.nome + "_comprovante_aquisicao",
                type: anexoContratante.comprovanteAquisicaoImovelFile.type,
              }
            )
          }
          if(anexoContratante.comprovanteEnderecofile.base64){
            base64List.push(
              {
                base64: anexoContratante.comprovanteEnderecofile.base64,
                name:contrato[0].contratante.nome + "_comprovante_endereco",
                type: anexoContratante.comprovanteEnderecofile.type,
              }
            )
          }
          if(anexoContratante.cpfConjugueFile.base64){
            base64List.push(
              {
                base64: anexoContratante.cpfConjugueFile.base64,
                name: contrato[0].contratante.nome + "_cpf_cônjuge",
                type: anexoContratante.cpfConjugueFile.type,
              }
            )
          }
          if(anexoContratante.cetidaoCasamentoFile.base64){
            base64List.push(
              {
                base64: anexoContratante.cetidaoCasamentoFile.base64,
                name: contrato[0].contratante.nome + "_certidao_casamento",
                type: anexoContratante.cetidaoCasamentoFile.type,
              }
            )
          }
          if(anexoContratante.cpfFile.base64){
            base64List.push(
              {
                base64: anexoContratante.cpfFile.base64,
                name: contrato[0].contratante.nome + "_cpf",
                type: anexoContratante.cpfFile.type,
              }
            )
          }
          if(anexoContratante.rgConjugueFile.base64){
            base64List.push(
              {
                base64: anexoContratante.rgConjugueFile.base64,
                name: contrato[0].contratante.nome + "_cpf_cônjuge",
                type: anexoContratante.rgConjugueFile.type,
              }
            )
          }
          if(anexoContratante.rgFile.base64){
            base64List.push(
              {
                base64: anexoContratante.rgFile.base64,
                name: contrato[0].contratante.nome + "_rg",
                type: anexoContratante.rgFile.type,
              }
            )
          }
          if(contrato[0]?.imovel?.fotos){
            base64List.push(
              {
                base64: contrato[0]?.imovel?.fotos?.base64,
                name: contrato[0].contratante.nome + "_imovel_foto",
                type: contrato[0]?.imovel?.fotos?.type,
              }
            )
          }

          this.data = base64List;
      }else{
        this.router.navigate(["/usuario/lista"]);
      }
    });
  }
}
