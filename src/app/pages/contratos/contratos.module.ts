import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratosGridComponent } from './contratos-grid/contratos-grid.component';
import { ContratosFormComponent } from './contratos-form/contratos-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InputfileModule } from '../../components/inputfile/inputfile.module';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import { PagamentoCalculoModule } from '../../components/pagamento-calculo/pagamento-calculo.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SignaturePadModule } from '../../components/signature-pad/signature-pad.module';
import { DialogModule } from '@angular/cdk/dialog';



  const routes: Routes = [
  { path: 'form/:id', component: ContratosFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: ContratosFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: ContratosFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: ContratosGridComponent, canActivate: [authGuard] },
];
  

@NgModule({
  declarations: [ ContratosGridComponent, ContratosFormComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    DialogModule,
    InputfileModule ,
    PagamentoCalculoModule,
    SignaturePadModule,
    MatProgressBarModule,
    RouterModule.forChild(routes)
  ],
  providers: [ ] 
})
export class ContratosModule { }
