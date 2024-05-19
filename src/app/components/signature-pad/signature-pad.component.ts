import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrl: './signature-pad.component.css'
})
export class SignaturePadComponent {
  @ViewChild('signaturePad', { static: true }) signaturePadElement!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;
  @Input() active: any;

  @Output() dataEvent = new EventEmitter<any>();

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement, {});
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

  saveSignature(): void {
    const base64Data = this.signaturePad.toDataURL(); 

    this.dataEvent.emit({nome: this.active, base64: base64Data});
    this.signaturePad.clear();
  }
}
