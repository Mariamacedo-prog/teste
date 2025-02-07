
import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToolboxService } from '../components/toolbox/toolbox.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root' 
})
export class PlanosService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('planos');
  }

  getItems(): Observable<any[]> {
    return this.itemsCollection.valueChanges({ idField: 'id' });
  }

  getItemsByEmpresaId(empresaId: string): Observable<any[]> {
    return this.firestore.collection('planos', ref => ref.where('empresaId', '==', empresaId)).valueChanges({ idField: 'id' });
  }

  getActiveItems(): Observable<any[]> {
    return this.firestore.collection<any>('planos', ref => ref.where('status', '==', true))
    .valueChanges({ idField: 'id' });
  }

  
  async save(user: any): Promise<void> { 
    return await this.itemsCollection.add(user).then(() => undefined);
  }

  findById(id: string): Observable<any> {
    return this.itemsCollection.doc(id).valueChanges({ idField: 'id' });
  }

  async updateItem(id: any, newData: any): Promise<void> {
    try {
      await this.itemsCollection.doc(id).update(newData);
      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/planos/lista']);
    } catch (error) {
      this.toolboxService.showTooltip('error', 'Ocorreu um erro ao atualizar', 'ERROR!');
    }
  }

  deleteItem(id: any): Promise<void> {
    return this.itemsCollection.doc(id).delete();
  }
}
