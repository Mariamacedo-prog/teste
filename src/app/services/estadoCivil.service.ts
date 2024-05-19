import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToolboxService } from '../components/toolbox/toolbox.service';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadoCivilService {
  private itemsCollection!: AngularFirestoreCollection<any>; 
  estadoCivil = [
    { "label": "Solteiro", "id": 1 },
    { "label": "Casado", "id": 2 },
    { "label": "Divorciado", "id": 3 },
    { "label": "Viúvo", "id": 4 },
    { "label": "União Estável", "id": 5 },
    { "label": "Separado Judicialmente", "id": 6 }
  ];

  constructor(private firestore: AngularFirestore, private http: HttpClient, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('estadoCivil');
    
  }

  getEstadoCivil(){
    return this.estadoCivil
  }

  getItems(): Observable<any[]> {
    return this.itemsCollection.valueChanges({ idField: 'id' });
  }
}
