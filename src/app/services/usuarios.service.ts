
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
export class UsuariosService {
  private itemsCollection!: AngularFirestoreCollection<any>; 

  constructor(private firestore: AngularFirestore, private toolboxService: ToolboxService, private router: Router) {
    this.itemsCollection = this.firestore.collection('usuarios');
  }

  getItems(): Observable<any[]> {
    return this.firestore.collection('usuarios').valueChanges({ idField: 'id' });
  }


  checkIfCPFExists(cpf: string): Observable<boolean> {
    return this.firestore.collection('usuarios', ref => ref.where('cpf', '==', cpf))
      .get()
      .pipe(
        map(querySnapshot => !querySnapshot.empty)
      );
  }

  async saveUser(user: any): Promise<any> { 
    const docRef = await this.firestore.collection('usuarios').add(user);

    const docSnapshot: any = await docRef.get();
    return { id: docRef.id, ...docSnapshot.data() };
  }

  findByCpfSenha(cpf: string, senha: string): Observable<any[]> {
    return this.firestore.collection('usuarios', 
      ref => ref.where('cpf', '==', cpf).where('senha', '==', senha)).valueChanges();
  }

  findById(id: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(id).valueChanges({ idField: 'id' });
  }

  async updateItem(id: any, newData: any): Promise<any> {
    const cpf = newData.cpf;
  
    try {
      const users = await firstValueFrom(this.firestore.collection('usuarios', ref => ref.where('cpf', '==', cpf)).valueChanges({ idField: 'id' }));
      if (users.length > 0 && users[0].id !== id) {
        this.toolboxService.showTooltip('error', 'CPF já cadastrado no banco de dados!', 'ERROR!');
        throw new Error('CPF já cadastrado no banco de dados!');
      } else {
        this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
        this.router.navigate(['/usuario/lista']);
        await this.itemsCollection.doc(id).update(newData);
        return { id: id, ...newData };
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
