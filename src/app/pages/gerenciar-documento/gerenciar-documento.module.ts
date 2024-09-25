import { GerenciarDocumentoGridComponent } from './gerenciar-documento-grid/gerenciar-documento-grid.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GerenciarDocumentoFormComponent } from './gerenciar-documento-form/gerenciar-documento-form.component';
import { authGuard } from '../../auth/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';




const routes: Routes = [
  { path: 'form/:id', component: GerenciarDocumentoFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: GerenciarDocumentoFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: GerenciarDocumentoFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: GerenciarDocumentoGridComponent, canActivate: [authGuard] },
];


@NgModule({
  declarations: [ GerenciarDocumentoFormComponent, GerenciarDocumentoGridComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(routes)
  ]
})
export class GerenciarDocumentoModule { }
