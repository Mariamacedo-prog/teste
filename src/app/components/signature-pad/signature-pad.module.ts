import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignaturePadComponent } from './signature-pad.component';


@NgModule({
  declarations: [SignaturePadComponent],
  imports: [
    CommonModule
  ],exports:[SignaturePadComponent]
})
export class SignaturePadModule { }
