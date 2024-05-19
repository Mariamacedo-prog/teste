import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PagamentoCalculoComponent } from './pagamento-calculo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatNativeDateModule,  DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from './pagamento-calculo.component';


@NgModule({
  declarations: [PagamentoCalculoComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatRadioModule,
    MatSlideToggleModule
  ],
  exports: [PagamentoCalculoComponent],
  providers:[ { provide: MY_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },]
})
export class PagamentoCalculoModule {

 }
