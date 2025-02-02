import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogModule } from '@angular/cdk/dialog';
import { EmpresasFormComponent } from './empresas-form/empresas-form.component';
import { EmpresasGridComponent } from './empresas-grid/empresas-grid.component';


const routes: Routes = [
  { path: 'form/:id', component: EmpresasFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: EmpresasFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: EmpresasFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: EmpresasGridComponent, canActivate: [authGuard] },
];

@NgModule({
  declarations: [ EmpresasFormComponent, EmpresasGridComponent],
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
    DialogModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    RouterModule.forChild(routes)
  ]
})
export class EmpresasModule { }
