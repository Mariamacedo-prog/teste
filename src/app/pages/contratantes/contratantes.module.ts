import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratanteGridComponent} from './contratante-grid/contratante-grid.component';
import { ContratanteFormComponent } from './contratante-form/contratante-form.component';
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

const routes: Routes = [
  { path: 'form/:id', component: ContratanteFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: ContratanteFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: ContratanteFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: ContratanteGridComponent, canActivate: [authGuard] },
];


@NgModule({
  declarations: [ ContratanteGridComponent, ContratanteFormComponent],
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
export class ContratantesModule { }
