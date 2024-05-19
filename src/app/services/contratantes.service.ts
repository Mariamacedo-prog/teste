import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToolboxService } from '../components/toolbox/toolbox.service';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratantesService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('contratantes');
  }

  getItems(): Observable<any[]> {
    return this.itemsCollection.valueChanges({ idField: 'id' });
  }


  checkIfCPFExists(cpf: string): Observable<boolean> {
    return this.firestore.collection('contratantes', ref => ref.where('cpf', '==', cpf))
      .get()
      .pipe(
        map(querySnapshot => !querySnapshot.empty)
      );
  }


  async save(user: any): Promise<void> { 
    await this.itemsCollection.add(user);
  }

  findById(id: string): Observable<any> {
    return this.itemsCollection.doc(id).valueChanges({ idField: 'id' });
  }

  async updateItem(id: any, newData: any): Promise<void> {
    const cpf = newData.cpf;
  
    try {
      const contratante = await firstValueFrom(this.firestore.collection('contratantes', ref => ref.where('cpf', '==', cpf)).valueChanges({ idField: 'id' }));
      if (contratante.length > 0 && contratante[0].id !== id) {
        this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
        throw new Error('CPF já cadastrado no banco de dados!');
      } else {
        this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
        this.router.navigate(['/contratante/lista']);
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
