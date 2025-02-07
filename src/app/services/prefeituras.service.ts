
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
export class PrefeiturasService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('prefeituras');
  }

  getItems(): Observable<any[]> {
    return this.firestore.collection('prefeituras').valueChanges({ idField: 'id' });
  }

  getItemsByEmpresaId(empresaId: string): Observable<any[]> {
    return this.firestore.collection('prefeituras', ref => ref.where('empresaId', '==', empresaId)).valueChanges({ idField: 'id' });
  }

  checkIfcnpjExists(cnpj: string): Observable<boolean> {
    return this.firestore.collection('prefeituras', ref => ref.where('cnpj', '==', cnpj))
      .get()
      .pipe(
        map(querySnapshot => !querySnapshot.empty)
      );
  }


  async save(user: any): Promise<void> { 
    return await this.itemsCollection.add(user).then(() => undefined);
  }

  findById(id: string): Observable<any> {
    return this.itemsCollection.doc(id).valueChanges({ idField: 'id' });
  }

  async updateItem(id: any, newData: any): Promise<void> {
    const cnpj = newData.cnpj;
  
    try {
      const users = await firstValueFrom(this.firestore.collection('prefeituras', ref => ref.where('cnpj', '==', cnpj)).valueChanges({ idField: 'id' }));
      if (users.length > 0 && users[0].id !== id) {
        this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
        throw new Error('CPF já cadastrado no banco de dados!');
      } else {
        this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
        this.router.navigate(['/prefeitura/lista']);
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
