import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioGridComponent } from './funcionario-grid/funcionario-grid.component';
import { FuncionarioFormComponent } from './funcionario-form/funcionario-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DialogModule } from '@angular/cdk/dialog';
const routes: Routes = [
  { path: 'form/:id', component: FuncionarioFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: FuncionarioFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: FuncionarioFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: FuncionarioGridComponent, canActivate: [authGuard] }
];


@NgModule({
  declarations: [FuncionarioGridComponent, FuncionarioFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCardModule,
    DialogModule,
    MatAutocompleteModule,
    RouterModule.forChild(routes)
  ]
})
export class FuncionariosModule { }
