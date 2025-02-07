import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu = [
    {"icon": "group", "value": "usuario", "label": "Usuários", "route": "/usuario/lista", id: 1, principal: false}, 
    {"icon": "how_to_reg", "value": "acesso", "label": "Acessos", "route": "/acesso/lista", id: 2, principal: false},
    {"icon": "account_box", "value": "funcionario", "label": "Funcionários", "route": "/funcionario/lista", id: 3, principal: false},
    {"icon": "tag_faces", "value": "contratante", "label": "Contratante", "route": "/contratante/lista", id: 4, principal: false},
    {"icon": "location_city", "value": "imovel", "label": "Imóvel", "route": "/imovel/lista", id: 5, principal: false},
    {"icon": "nature_people", "value": "vendedor", "label": "Vendedores / Corretores", "route": "/vendedor/lista", id: 6, principal: false},
    {"icon": "flag", "label": "Prefeitura", "value": "prefeitura", "route": "/prefeitura/lista", id: 7, principal: false},
    {"icon": "gavel", "label": "Cartório", "value": "cartorio", "route": "/cartorio/lista", id: 8, principal: false},

    {"icon": "local_atm", "label": "Planos", "value": "plano",   "route": "/planos/lista", id: 9, principal: false},
    {"icon": "linear_scale", "label": "Status", "value": "status",   "route": "/status/lista", id: 10, principal: false},
    {"icon": "radio_button_unchecked", "label": "Núcleos", "value": "nucleo",   "route": "/nucleos/lista", id: 11, principal: false},
    {"icon": "border_color", "label": "Contratos", "value": "contrato",   "route": "/contrato/lista", id:12, principal: false},
    {"icon": "folder_open", "label": "Gerenciar Documentos", "value": "gerenciar_documento",   "route": "/gerenciarDocumento/lista", id: 13, principal: false},
    {"icon": "folder_closed", "label": "Franqueados", "value": "empresas",   "route": "/empresas/lista", id: 14, principal: true},
  ]
  constructor(private firestore: AngularFirestore) {}

  getMenuItems(): any[]{
   // return this.firestore.collection('menu').valueChanges({ idField: 'id' });
   return this.menu;
  }
}
