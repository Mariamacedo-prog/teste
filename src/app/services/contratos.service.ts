import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ToolboxService } from '../components/toolbox/toolbox.service';
import { Router } from '@angular/router';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";


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

  updateAllStatusByNucleo(nucleo: any, newStatus: any): Promise<void> {
    try {
      return this.firestore.collection('contratos', ref => ref.where('nucleo_nome', '==', nucleo.nome))
        .get()
        .toPromise()
        .then((resp: any) => {
  
        let batch = this.firestore.firestore.batch();
        resp.docs.forEach((userDocRef: any) => {
          console.log("userDocRef", userDocRef.ref)
          batch.update(userDocRef.ref, {'status': newStatus});
          this.toolboxService.showTooltip('success', 'Atualizado com sucesso!', 'Sucesso!');
          this.router.navigate(['/status/lista']);
        })
        batch.commit().catch(err => {
          this.toolboxService.showTooltip('error', 'Não foi possível atualizar, verifique os dados e tente novamente!', 'ERROR!');
          console.error(err)
        });
      }).catch((error: any) =>{ 
        this.toolboxService.showTooltip('error', 'Não foi possível atualizar, verifique os dados e tente novamente!', 'ERROR!');
        console.error(error)
      })
    } catch (error) {
      this.toolboxService.showTooltip('error', 'Não foi possível atualizar, verifique os dados e tente novamente!', 'ERROR!');
      throw new Error('Não foi possível atualizar, verifique os dados e tente novamente!');
    }
  }
}

