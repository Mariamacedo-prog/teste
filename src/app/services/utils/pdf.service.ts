import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; 

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

    convertBase64ToPDF(base64String: string): Blob {
        // const binaryString = window.atob(base64String);
        // const len = binaryString.length;
        // const bytes = new Uint8Array(len);
        // for (let i = 0; i < len; i++) {
        //     bytes[i] = binaryString.charCodeAt(i);
        // }

        // const blob = new Blob([bytes], { type: 'application/pdf' });

        // const url = URL.createObjectURL(blob);

        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `${fileName}_pdf`; 
        // document.body.appendChild(a);
        // a.click();

        // document.body.removeChild(a);

        // URL.revokeObjectURL(url);
        const binaryString = window.atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    
        // Retorna o Blob ao invés de acionar o download diretamente
        return new Blob([bytes], { type: 'application/pdf' });
    }

    public async downloadPdfImages(base64Images: any[]): Promise<Blob> {
        const doc = new jsPDF();
        const jpgimages = base64Images.filter(item => item.type !== 'pdf');
    
        const promises = jpgimages.map((base64ImageObject, index) => {
            return new Promise<void>((resolve) => {
                let base64Image = base64ImageObject.base64 || '';
                if ((base64Image.startsWith('data:image/jpeg') || base64Image.startsWith('data:image/png'))) {
                    const img = new Image();
                    img.src = base64Image;
    
                    img.onload = () => {
                        const imgWidth = doc.internal.pageSize.getWidth();
                        const imgHeight = (img.height * imgWidth) / img.width;
    
                        if (index === 0) {
                            doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
                        } else {
                            doc.addPage();
                            doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
                        }
    
                        resolve();
                    };
    
                    img.onerror = () => {
                        console.error(`Erro ao carregar a imagem na posição ${index}: Base64 inválido`);
                        resolve(); // Resolve mesmo em caso de erro
                    };
                } else {
                    resolve();
                }
            });
        });
    
        return Promise.all(promises).then(() => {
            // Instead of saving the PDF directly, return it as a blob
            return doc.output('blob');
        });
    }

    
    public downloadPdfFromBlob(pdfBlob: Blob, fileName: string) {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}