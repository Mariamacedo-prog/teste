import { Component, EventEmitter, Input, Output } from '@angular/core';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
@Component({
  selector: 'app-file-input',
  templateUrl: './inputfile.component.html',
  styleUrls: ['./inputfile.component.css']
})
export class InputfileComponent {
  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();
  @Input() nome: string = '';
  nomeBotao: string = 'Selecionar Arquivo';
  maxNomeBotaoLength: number = 25;
  pdfSrc: any;
  imagemSrc: string | undefined;
  @Input() accept: string = '.pdf,.jpg';

  @Input() fileInput: { base64: string, type: string }= { base64: '', type: '' };
  @Output() fileOutput: EventEmitter<{ base64: string, type: string }> = new EventEmitter<{ base64: string, type: string }>();
 
  constructor(public sanitizer:DomSanitizer) {
  }

  ngOnInit(){
    this.imagemSrc = undefined;
    this.pdfSrc = undefined;
    if(this.fileInput  && this.fileInput.type && this.fileInput.base64){
      if(this.fileInput.type == 'pdf' && this.fileInput.base64 ){
        this.convertBase64ToPDF(this.fileInput.base64);
      }else if(this.fileInput.type == 'jpg' && this.fileInput.base64){
        this.imagemSrc = this.fileInput.base64;
        this.pdfSrc = undefined;
      }else{
        this.imagemSrc = undefined;
        this.pdfSrc = undefined;
      }
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.convertToBase64(selectedFile);
    }
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        const base64String = (reader.result as string).split(',')[1];
        if (file.type.startsWith('image/')) {
          this.imagemSrc = 'data:image/jpeg;base64,' + base64String;
          this.fileOutput.emit({base64: this.imagemSrc, type: 'jpg'});
          this.pdfSrc = undefined; // Limpa o pdfSrc, se existir
        } else if (file.type === 'application/pdf') {
          this.convertBase64ToPDF(base64String)
          this.fileOutput.emit({base64: base64String, type: 'pdf'});
        } else {
        }
      } else {
        console.error('Error: reader.result is null.');
      }

    };
    reader.onerror = error => {
      console.error('Error converting to Base64:', error);
    };
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
}