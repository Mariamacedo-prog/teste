import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' 
})
export class GerenciarDocumentoService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore) {}

  getItems(): Observable<any[]> {
    const contratante$ = this.firestore.collection('contratantes').valueChanges({ idField: 'id' }).pipe(
  
    );
    const imoveis$ = this.firestore.collection('imoveis').valueChanges({ idField: 'id' }).pipe(
  
    );
    const contrato$ = this.firestore.collection('contratos').valueChanges({ idField: 'id' }).pipe(
   
    );
  
    return combineLatest([contratante$, imoveis$, contrato$]).pipe(
      map(([contratantes, imoveis, contratos]) => {
        return contratos.map((contrato: any) => {
          const newContrato: any = {
            contrato,
            contratante: contratantes.find(c => c.id === contrato.contratante.id) || null,
            imovel: imoveis.find(i => i.id === contrato.imovelId) || null,
          };
          return newContrato;
        });
      }),
     
    );
  }

  getById(id: any): Observable<any[]> {
    const contratante$ = this.firestore.collection('contratantes').valueChanges({ idField: 'id' });
    const imoveis$ = this.firestore.collection('imoveis').valueChanges({ idField: 'id' });
    const contrato$ = this.firestore.collection('contratos').valueChanges({ idField: 'id' });
  
    return combineLatest([contratante$, imoveis$, contrato$]).pipe(
      map(([contratantes, imoveis, contratos]) => {
        const contrato: any = contratos.find((contrato: any) => contrato.id === id);
  
        if (contrato) {
          const newContrato = {
            contrato,
            contratante: contratantes.find(c => c.id === contrato.contratante.id) || null,
            imovel: imoveis.find(i => i.id === contrato.imovelId) || null,
          };
          return [newContrato];
        } else {
          return [];
        }
      })
    );
  }
}