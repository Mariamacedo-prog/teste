import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanosFormComponent } from './planos-form/planos-form.component';
import { PlanosGridComponent } from './planos-grid/planos-grid.component';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'form/:id', component: PlanosFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: PlanosFormComponent, canActivate: [authGuard] },
  { path: 'nova', component: PlanosFormComponent, canActivate: [authGuard] },
  { path: 'lista', component:  PlanosGridComponent, canActivate: [authGuard] }
];


@NgModule({
  declarations: [
    PlanosFormComponent,
    PlanosGridComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PlanosModule { }
