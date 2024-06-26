import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrefeituraFormComponent } from './prefeitura-form/prefeitura-form.component';
import { PrefeituraGridComponent } from './prefeitura-grid/prefeitura-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InputfileModule } from '../../components/inputfile/inputfile.module';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogModule } from '@angular/cdk/dialog';
const routes: Routes = [
    { path: 'form/:id', component: PrefeituraFormComponent, canActivate: [authGuard] },
    { path: 'form/:id/:tela', component: PrefeituraFormComponent, canActivate: [authGuard] },
    { path: 'nova', component: PrefeituraFormComponent, canActivate: [authGuard] },
    { path: 'lista', component: PrefeituraGridComponent, canActivate: [authGuard] }
];

@NgModule({
    declarations: [
        PrefeituraFormComponent,
        PrefeituraGridComponent
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
        DialogModule,
        MatCardModule,
        MatAutocompleteModule,
        MatSelectModule,
        RouterModule.forChild(routes),
        InputfileModule
    ]
})
export class PrefeituraModule { }
