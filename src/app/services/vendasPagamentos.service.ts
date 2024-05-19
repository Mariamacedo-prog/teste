
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
export class VendasPagamentosService {
  private itemsCollection!: AngularFirestoreCollection<any>; 
  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('vendas');
  }

  getItems(): Observable<any[]> {
    return this.firestore.collection('vendas').valueChanges({ idField: 'id' });
  }

  async checkIfIdContratanteExists(id: string): Promise<boolean> {
    try {
      const items = await firstValueFrom(this.itemsCollection.valueChanges({ idField: 'id' }));
      if (items) {
        const contratanteExists = items.some(item => item.contratante.id === id);
        return contratanteExists;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar a existência do contratante:", error);
      throw error;
    }
  }

  async checkIfImovelExists(id: string): Promise<boolean> {
    try {
      const items = await firstValueFrom(this.itemsCollection.valueChanges({ idField: 'id' }));
      if (items) {
        const imovelExists = items.some(item => item.idImovel === id);
        return imovelExists;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar a existência do Imovel:", error);
      throw error;
    }
  }
  

  findByContratanteId(id: string): Observable<any[]> {
    return this.firestore.collection('vendas', 
      ref => ref.where('contratante.id', '==', id)).valueChanges({ idField: 'id' });
  }

  async save(item: any): Promise<void> { 
    return await this.itemsCollection.add(item).then(() => undefined);
  }

  findById(id: string): Observable<any> {
    return this.itemsCollection.doc(id).valueChanges({ idField: 'id' });
  }

  async updateItem(id: any, newData: any): Promise<void> {
    try {
      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      await this.itemsCollection.doc(id).update(newData);
    } catch (error) {
      this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
    }
  }

  deleteItem(id: any): Promise<void> {
    return this.itemsCollection.doc(id).delete();
  }
}
