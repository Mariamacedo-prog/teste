import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfService } from '../../services/utils/pdf.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-visualizer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './visualizer.component.html',
  styleUrl: './visualizer.component.css'
})
export class VisualizerComponent {
  @Input() nome: string = '';
  @Input() base64: string = "";
  @Input() type: string =  '';
  filename = "";
  pdfSrc: any = '';
  imagemSrc: string | undefined;

   
  constructor(public sanitizer:DomSanitizer, public pdfService: PdfService) {
  }

  ngOnInit(){
    this.imagemSrc = undefined;
    this.pdfSrc = undefined;
    if( this.type && this.base64){
      if(this.type == 'pdf' && this.base64 ){
        this.convertBase64ToPDF(this.base64);
      }else if(this.type == 'jpg' && this.base64){
        this.imagemSrc = this.base64;
        this.pdfSrc = undefined;
      }else{
        this.imagemSrc = undefined;
        this.pdfSrc = undefined;
      }
    }
    this.filename=`${this.nome + "."+this.type}`
  }

   convertBase64ToPDF(base64String: string) {
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    this.imagemSrc = undefined;
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  downloadPdf() {
    if((this.type != 'pdf')){
      this.pdfService.downloadPdfImages([{name: this.nome, base64: this.base64, type: this.type}]).then((pdfBlob) => {
        this.pdfService.downloadPdfFromBlob(pdfBlob, `${this.nome}.pdf`);
      }).catch(error => {
        console.error('Erro ao gerar PDF:', error);
      });
    }else{
      const pdfBlob =  this.pdfService.convertBase64ToPDF(this.base64)
      this.pdfService.downloadPdfFromBlob(pdfBlob, `${this.nome}.pdf`);
    }
  }
}
