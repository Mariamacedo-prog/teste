
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
export class ContratosService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('contratos');
  }

  getItems(): Observable<any[]> {
    return this.firestore.collection('contratos').valueChanges({ idField: 'id' });
  }


  checkIfcnpjExists(cnpj: string): Observable<boolean> {
    return this.firestore.collection('contratos', ref => ref.where('cnpj', '==', cnpj))
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
    try {
      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/contrato/lista']);
      await this.itemsCollection.doc(id).update(newData);
    } catch (error) {
      this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
      throw new Error('CPF já cadastrado no banco de dados!');
    }
  }

  deleteItem(id: any): Promise<void> {
    return this.itemsCollection.doc(id).delete();
  }
}
