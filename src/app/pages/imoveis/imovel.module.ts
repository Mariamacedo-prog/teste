import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImovelGridComponent } from './imovel-grid/imovel-grid.component';
import { ImovelFormComponent } from './imovel-form/imovel-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InputfileModule } from '../../components/inputfile/inputfile.module';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DialogModule } from '@angular/cdk/dialog';

const routes: Routes = [
  { path: 'form/:id', component: ImovelFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: ImovelFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: ImovelFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: ImovelGridComponent, canActivate: [authGuard] },
];  
@NgModule({
  declarations: [ImovelFormComponent, ImovelGridComponent],
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
    InputfileModule ,
    MatProgressBarModule,
    DialogModule,
    RouterModule.forChild(routes)
  ]
})
export class ImovelModule { }
