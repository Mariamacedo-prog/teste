import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { authGuard } from '../../auth/auth.guard';
import { NucleosFormComponent } from './nucleos-form/nucleos-form.component';
import { NucleosGridComponent } from './nucleos-grid/nucleos-grid.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes: Routes = [
  { path: 'form/:id', component: NucleosFormComponent, canActivate: [authGuard] },
  { path: 'form/:id/:tela', component: NucleosFormComponent, canActivate: [authGuard] },
  { path: 'novo', component: NucleosFormComponent, canActivate: [authGuard] },
  { path: 'lista', component:  NucleosGridComponent, canActivate: [authGuard] }
];

@NgModule({
  declarations: [NucleosFormComponent, NucleosGridComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class NucleosModule { }
