import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcessoGridComponent } from './acesso-grid/acesso-grid.component';
import { AcessoFormComponent } from './acesso-form/acesso-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import {MatProgressBarModule} from '@angular/material/progress-bar';

const routes: Routes = [
  { path: 'permissao/usuario/:id', component: AcessoFormComponent, canActivate: [authGuard] },
  { path: 'adicionar/grupo/:id', component: AcessoFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: AcessoFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: AcessoGridComponent, canActivate: [authGuard] }
];

@NgModule({
  declarations: [
    AcessoGridComponent,
    AcessoFormComponent
  ],
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
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressBarModule,
    MatListModule,
    RouterModule.forChild(routes)
  ]
})
export class AcessosModule { }
