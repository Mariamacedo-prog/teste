import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanosFormComponent } from './planos-form/planos-form.component';
import { PlanosGridComponent } from './planos-grid/planos-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
  { path: 'form/:id', component: PlanosFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: PlanosFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: PlanosFormComponent, canActivate: [authGuard] },
  { path: 'lista', component:  PlanosGridComponent, canActivate: [authGuard] }
];


@NgModule({
  declarations: [
    PlanosFormComponent,
    PlanosGridComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class PlanosModule { }
