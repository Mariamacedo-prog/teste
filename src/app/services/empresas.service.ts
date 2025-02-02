
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
export class EmpresasService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('empresa');
  }

  getItems(): Observable<any[]> {
    return this.itemsCollection.valueChanges({ idField: 'id' });
  }


  checkIfcnpjExists(cnpj: string): Observable<boolean> {
    return this.firestore.collection('empresa', ref => ref.where('cnpj', '==', cnpj))
      .get()
      .pipe(
        map(querySnapshot => !querySnapshot.empty)
      );
  }

  async save(empresa: any): Promise<void> { 
    try {
      await this.itemsCollection.add(empresa);
    } catch (error) {
      console.error("Erro ao criar o item: ", error);
      throw error;
    }
  }

  findById(id: string): Observable<any> {
    return this.itemsCollection.doc(id).valueChanges({ idField: 'id' });
  }

  findByCnpj(cnpj: string): Observable<any[]> {
    return this.firestore.collection('empresa', 
      ref => ref.where('cnpj', '==', cnpj)).valueChanges();
  }

  findByName(name: string): Observable<any[]> {
    return this.firestore.collection('empresa', 
      ref => ref.where('nome', '==', name)).valueChanges();
  }

  findByEmpresaName(name: string): Observable<any[]> {
    return this.firestore.collection('empresa', 
      ref => ref.where('empresaNome', '==', name)).valueChanges();
  }

  async updateItem(id: any, newData: any): Promise<void> {
    const cnpj = newData.cnpj;
    try {
      const empresa = await firstValueFrom(this.firestore.collection('empresa', ref => ref.where('cnpj', '==', cnpj)).valueChanges({ idField: 'id' }));
      if (empresa.length > 0 && empresa[0].id !== id) {
        this.toolboxService.showTooltip('error',`CNPJ já cadastrado no banco de dados!`, 'ERROR!');
        throw new Error('CNPJ já cadastrado no banco de dados!');
      } else {
        this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
        this.router.navigate(['/empresas/lista']);
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
