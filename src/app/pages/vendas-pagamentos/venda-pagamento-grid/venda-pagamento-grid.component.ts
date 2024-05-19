import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-venda-pagamento-grid',
  templateUrl: './venda-pagamento-grid.component.html',
  styleUrl: './venda-pagamento-grid.component.css'
})
export class VendaPagamentoGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'estado' ,'statusEntrega', 'cartorio','situacaoPagamento', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService) {}
  adicionarNovo() {
    this.router.navigate(["/vendasPagamentos/novo"]);
  }

  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        if(JSON.parse(storedDb).vendasPagamentos){
          this.dataSource = JSON.parse(storedDb).vendasPagamentos;
          this.dataSourceFilter = JSON.parse(storedDb).vendasPagamentos;
        }
      }
    }, 1000)
  }

  procurar() {
    this.dataSourceFilter = this.dataSource.filter((vendasPagamentos: any) => vendasPagamentos.nome.includes(this.searchTerm) || vendasPagamentos.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  visualizarItem(element: any){
    this.router.navigate(["/vendaPagamento/" + element.id + "/visualizar"]);
  }

  editarItem(element: any){
    this.router.navigate(["/vendaPagamento/" + element.id]);
  }

  deletarItem(element: any){
    let databaseInfo: any = {};
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      databaseInfo = JSON.parse(storedDb);
    }
    const index = databaseInfo.vendasPagamentos.findIndex((item: any) => item.id == element.id);

    if (index !== -1) {
      databaseInfo.vendasPagamentos.splice(index, 1)
      this.toolboxService.showTooltip('success', 'Contrato foi deletado com sucesso!', 'SUCESSO!');
    }

    localStorage.setItem('appDb', JSON.stringify(databaseInfo));
    this.dataSourceFilter = databaseInfo.vendasPagamentos;
    this.dataSource = databaseInfo.vendasPagamentos;
  }
}



@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html'
})
export class DialogDelete {
  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    onYesClick(): void {
      this.dialogRef.close(true);
    }

    onCancelClick(): void {
      this.dialogRef.close(false);
    }
}