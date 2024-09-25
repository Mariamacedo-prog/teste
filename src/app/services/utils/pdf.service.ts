import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }
  
  public downloadPdfImages(base64Images: string[], pdfName: string = "documento-gerado"): void {
    const doc = new jsPDF();
  
    const promises = base64Images.map((base64Image, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = base64Image;
        img.onload = () => {
          // Adicionar a imagem ao PDF
          doc.addImage(base64Image, 'JPEG', 10, 10, 180, 240); // Ajuste o tamanho conforme necessário
  
          // Adiciona nova página após cada imagem, exceto a última
          if (index < base64Images.length - 1) {
            doc.addPage();
          }
  
          resolve();
        };
        img.onerror = () => {
          console.error(`Erro ao carregar a imagem na posição ${index}`);
          resolve(); // Resolver para continuar mesmo se a imagem falhar
        };
      });
    });
  
    Promise.all(promises).then(() => {
      // Salvar o arquivo PDF após todas as imagens terem sido adicionadas
      doc.save(`${pdfName}.pdf`);
    });
  }
}