import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ContratosService } from '../../../services/contratos.service';
import { CartoriosService } from '../../../services/cartorios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';


@Component({
  selector: 'app-contratos-grid',
  templateUrl: './contratos-grid.component.html',
  styleUrl: './contratos-grid.component.css'
})
export class ContratosGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'statusEntrega', 'cartorio','crfEntregue','nCrf', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';

  cartorios: any = [];
  cartorioSearch: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService,
     private contratosService: ContratosService, private cartoriosService: CartoriosService,
     public dialog: MatDialog) {}
  adicionarNovo() {
    this.router.navigate(["/contrato/novo"]);
  }

  ngOnInit(): void {
    this.findAll();

    this.cartoriosService.getItems().subscribe(cartorios => { 
      if (cartorios.length >= 0) {
        this.cartorios  = cartorios;
      }
    });
  }
  
  findAll(){
    this.contratosService.getItems().subscribe(contratos => {
      if (contratos.length >= 0) {
        this.dataSource = contratos;
        this.dataSourceFilter = contratos;
      }
    });
  }

  search() {
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }

    this.dataSourceFilter = this.dataSource.filter((contrato: any) => contrato.contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || contrato.contratante.cpf.includes(this.searchTerm));
 
    if(this.cartorioSearch != ''){
      this.dataSourceFilter = this.dataSourceFilter.filter((contrato: any) => contrato.cartorio.nome.toLowerCase().includes(this.cartorioSearch.toLowerCase()));
    }
  }

  viewItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/contrato/form/" + element.id]);
  }

  deleteItem(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Contrato do(a) Contratante "${element.contratante.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contratosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }

  cartorioSelected(event: any){
    const value = event?.value;
    this.cartorioSearch = value;
  }
}
