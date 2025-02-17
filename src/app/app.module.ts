
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { firebaseapp } from "../Firebase";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from './auth/auth.service';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AngularFireModule } from '@angular/fire/compat';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ExcelService } from './services/utils/excel.service';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/store';
import {MatSelectModule} from '@angular/material/select';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    ToolboxComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,  
    AngularFireModule.initializeApp(firebaseapp),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    StoreModule.forRoot({ auth: authReducer }), 
  ],
  providers: [
    AuthService,
    ExcelService,
    { provide: MY_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
