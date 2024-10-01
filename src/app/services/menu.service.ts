import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu = [
    {"icon": "group", "value": "usuario",    "label": "Usuários", "route": "/usuario/lista", id: 1}, 
    {"icon": "how_to_reg", "value": "acesso",    "label": "Acessos", "route": "/acesso/lista", id: 2},
    {"icon": "account_box", "value": "funcionario",   "label": "Funcionários", "route": "/funcionario/lista", id: 3},
    {"icon": "tag_faces", "value": "contratante",   "label": "Contratante", "route": "/contratante/lista", id: 4},
    {"icon": "location_city", "value": "imovel",   "label": "Imóvel", "route": "/imovel/lista", id: 5},
    {"icon": "nature_people", "value": "vendedor",   "label": "Vendedores / Corretores", "route": "/vendedor/lista", id: 6},
    {"icon": "flag", "label": "Prefeitura", "value": "prefeitura",   "route": "/prefeitura/lista", id: 7},
    {"icon": "gavel", "label": "Cartório", "value": "cartorio",   "route": "/cartorio/lista", id: 8},

    {"icon": "local_atm", "label": "Planos", "value": "plano",   "route": "/planos/lista", id: 11},
    {"icon": "linear_scale", "label": "Status", "value": "status",   "route": "/status/lista", id: 10},
    {"icon": "radio_button_unchecked", "label": "Núcleos", "value": "nucleo",   "route": "/nucleos/lista", id: 13},
    {"icon": "border_color", "label": "Contratos", "value": "contrato",   "route": "/contrato/lista", id: 9},
    {"icon": "folder_open", "label": "Gerenciar Documentos", "value": "gerenciar_documento",   "route": "/gerenciarDocumento/lista", id: 9}
  ]
  constructor(private firestore: AngularFirestore) {}

  getMenuItems(): any[]{
   // return this.firestore.collection('menu').valueChanges({ idField: 'id' });
   return this.menu;
  }
}
