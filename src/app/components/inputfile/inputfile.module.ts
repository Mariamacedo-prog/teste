import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputfileComponent } from './inputfile.component';
import { MatButtonModule } from '@angular/material/button';




@NgModule({
  declarations: [InputfileComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [InputfileComponent] 
})
export class InputfileModule { }
