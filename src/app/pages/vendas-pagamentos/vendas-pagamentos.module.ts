import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendaPagamentoGridComponent, DialogDelete } from './venda-pagamento-grid/venda-pagamento-grid.component';
import { VendaPagamentoFormComponent } from './venda-pagamento-form/venda-pagamento-form.component';
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
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
   { path: 'form/:id', component: VendaPagamentoFormComponent, canActivate: [authGuard] },
   { path: 'form/:id/:tela', component: VendaPagamentoFormComponent, canActivate: [authGuard] },
   { path: 'novo', component: VendaPagamentoFormComponent, canActivate: [authGuard] },
   { path: 'lista', component: VendaPagamentoGridComponent, canActivate: [authGuard] },
];

@NgModule({
  declarations: [ VendaPagamentoGridComponent, VendaPagamentoFormComponent, DialogDelete ],
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
    InputfileModule,
    MatDialogModule,
    RouterModule.forChild(routes) 
  ]
})
export class VendaPagamentoModule { }
