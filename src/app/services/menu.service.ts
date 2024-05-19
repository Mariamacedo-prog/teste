import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu = [
    {"icon": "group", "label": "Usuários", "route": "/usuario/lista", id: 1}, 
    {"icon": "how_to_reg", "label": "Acessos", "route": "/acesso/lista", id: 2},
    {"icon": "account_box", "label": "Funcionários", "route": "/funcionario/lista", id: 3},
    {"icon": "tag_faces", "label": "Contratante", "route": "/contratante/lista", id: 4},
    {"icon": "location_city", "label": "Imóvel", "route": "/imovel/lista", id: 5},
    {"icon": "nature_people", "label": "Vendedores", "route": "/vendedor/lista", id: 6},
    {"icon": "flag", "label": "Prefeitura", "route": "/prefeitura/lista", id: 7},
    {"icon": "gavel", "label": "Cartório", "route": "/cartorio/lista", id: 8},
    {"icon": "border_color", "label": "Contratos", "route": "/contrato/lista", id: 9}
  ]
  constructor(private firestore: AngularFirestore) {}

  getMenuItems(): {"icon": string, "label": string, "route": string, id: number}[]{
   // return this.firestore.collection('menu').valueChanges({ idField: 'id' });
   return this.menu;
  }
}
