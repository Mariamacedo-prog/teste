import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { UsuarioGridComponent } from './usuario-grid/usuario-grid.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { authGuard } from '../../auth/auth.guard';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DialogModule } from '@angular/cdk/dialog';

const routes: Routes = [
  { path: 'novo/cadastro', component: UsuarioFormComponent},
  { path: 'novo', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'form/:id', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: UsuarioFormComponent, canActivate: [authGuard] },
  { path: 'lista', component: UsuarioGridComponent, canActivate: [authGuard] }
];

@NgModule({
  declarations: [ UsuarioGridComponent, UsuarioFormComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    DialogModule,
    RouterModule.forChild(routes)
  ]
})
export class UsuariosModule { }
