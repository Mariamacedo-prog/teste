import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusFormComponent } from './status-form/status-form.component';
import { StatusGridComponent } from './status-grid/status-grid.component';
import { authGuard } from '../../auth/auth.guard';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
  { path: 'form/:id', component: StatusFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: StatusFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: StatusFormComponent, canActivate: [authGuard] },
  { path: 'lista', component:  StatusGridComponent, canActivate: [authGuard] }
];


@NgModule({
  declarations: [
    StatusFormComponent,
    StatusGridComponent 
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class StatusModule { }
