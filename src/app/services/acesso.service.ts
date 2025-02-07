import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToolboxService } from '../components/toolbox/toolbox.service';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, from } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AcessoService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('acessos');
  }

  getItems(): Observable<any[]> {
    return this.itemsCollection.valueChanges({ idField: 'id' });
  }

  getItemsByEmpresaId(empresaId: string): Observable<any[]> {
    return this.firestore.collection('acessos', ref => ref.where('empresaId', '==', empresaId)).valueChanges({ idField: 'id' });
  }


  async save(item: any): Promise<any> { 
    try {
      const docRef = await this.itemsCollection.add(item);
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error("Erro ao criar o item: ", error);
      throw error;
    }
  }

  findById(id: string): Observable<any> {
    return this.itemsCollection.doc(id).valueChanges({ idField: 'id' });
  }

  async updateItem(id: any, newData: any): Promise<void> {
    try {
      const acessos = await firstValueFrom(this.firestore.collection('acessos', ref => ref.where('nomeGrupo', '==', newData.nomeGrupo)).valueChanges({ idField: 'id' }));
      if (acessos.length > 0 && acessos[0].id !== id) {
        this.toolboxService.showTooltip('error', 'Acesso já cadastrado no banco de dados!', 'ERROR!');
        throw new Error('Acesso já cadastrado no banco de dados!');
      } else {
        this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
        this.router.navigate(['/acesso/lista']);
        await this.itemsCollection.doc(id).update(newData);
      }
    } catch (error) {
      console.error("Erro ao atualizar o item: ", error);
      throw error;
    }
  }

  deleteItem(id: any): Promise<void> {
    return this.itemsCollection.doc(id).delete();
  }
}
