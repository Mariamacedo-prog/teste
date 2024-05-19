
import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToolboxService } from '../components/toolbox/toolbox.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root' 
})
export class ImoveisService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('imoveis');
  }

  getItems(): Observable<any[]> {
    return this.firestore.collection('imoveis').valueChanges({ idField: 'id' });
  }

  checkByContratanteId(contratanteId: any): Observable<any[]> {
    return this.firestore.collection('imoveis', ref => ref.where('contratante.id', '==', contratanteId))
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
       console.log(newData.enderecoPorta.fotos);
      if (!newData.enderecoPorta) {
          newData.enderecoPorta = {}; 
          newData.enderecoPorta.fotos = []; 
      }

      await this.itemsCollection.doc(id).update(newData);
      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/imovel/lista']);
    } catch (error) {
      this.toolboxService.showTooltip('error', 'Ocorreu um erro ao atualizar', 'ERROR!');
    }
  }

  deleteItem(id: any): Promise<void> {
    return this.itemsCollection.doc(id).delete();
  }
}
