import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';

@Component({
  selector: 'app-acesso-grid',
  templateUrl: './acesso-grid.component.html',
  styleUrl: './acesso-grid.component.css'
})
export class AcessoGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'grupo','actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  dataGrupoSource:any = [];
  dataGrupoSourceFilter:any = [];
  displayedGrupoColumns: string[] = ['nome','actions'];
  searchTermGrupo: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}

 
  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');

      if (storedDb) {
        if(JSON.parse(storedDb).acessos){
          this.dataSource = JSON.parse(storedDb).acessos;
          this.dataSourceFilter = JSON.parse(storedDb).acessos;
          this.dataGrupoSource = JSON.parse(storedDb).gruposAcessos;
          this.dataGrupoSourceFilter = JSON.parse(storedDb).gruposAcessos;
        }
      }
    }, 1000)
  }

  adicionarNovo() {
    this.router.navigate(["/acesso/novo"]);
  }
  
  procurar() {
    this.dataSourceFilter = this.dataSource.filter((acesso: any) => acesso.usuario.nome.includes(this.searchTerm) || acesso.usuario.cpf.includes(this.searchTerm) || acesso.grupo?.nome.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  adicionarNovoGrupo() {
    this.router.navigate(["/acesso/novo"]);
  }
  
  procurarGrupo() {
    this.dataGrupoSourceFilter = this.dataGrupoSource.filter((acesso: any) => acesso.nome.includes(this.searchTermGrupo));
    if(this.searchTermGrupo.length == 0){
      this.dataGrupoSourceFilter = this.dataGrupoSource;
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/usuario/form/" + element.usuario.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/usuario/form/" + element.usuario.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.acessos.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.acessos.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Acesso foi deletado com sucesso!', 'SUCESSO!');
    }

    // const indexUsuario = databaseInfo.usuarios.findIndex((item: any) => item.id == element.usuario.id);

    // if (indexUsuario !== -1) {
    //   databaseInfo.usuarios.splice(indexUsuario, 1)
    //   this.toolboxService.showTooltip('success', 'Acesso foi deletado com sucesso!', 'SUCESSO!');
    // }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.acessos;
    this.dataSource = databaseInfo.acessos;
  }

  gerenciarPermissoes(element: any){
    this.router.navigate(["/acesso/permissao/usuario/" + element.id]);
    
  }
  
  adicionarGrupo(element: any){
    this.router.navigate(["/acesso/adicionar/grupo/" + element.id]);
  }
}
