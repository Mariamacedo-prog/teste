import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ContratantesService } from '../../../services/contratantes.service';
import { CartoriosService } from '../../../services/cartorios.service';
import {  MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-contratante-grid',
  templateUrl: './contratante-grid.component.html',
  styleUrl: './contratante-grid.component.css'
})
export class ContratanteGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade', 'estado' ,'situacaoPagamento', 'cartorio','data','valoresReceber','valoresRecebidos', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  cartorios: any = [];

  cartorioSearch: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, public dialog: MatDialog,
    private contratantesService: ContratantesService, private cartoriosService: CartoriosService) {}
  adicionarNovo() {
    this.router.navigate(["/contratante/novo"]);
  }

  findAll(){
    this.contratantesService.getItems().subscribe(contratante => { 
      if (contratante.length >= 0) {
        this.dataSource = contratante;
        this.dataSourceFilter = contratante;
      }
    });
  }

  ngOnInit(): void {
    this.findAll();

    this.cartoriosService.getItems().subscribe(cartorios => { 
      if (cartorios.length >= 0) {
        this.cartorios  = cartorios;
      }
    });
  }

  search() {
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
    
    this.dataSourceFilter = this.dataSource.filter((contratante: any) => contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || contratante.cpf.includes(this.searchTerm));
   
    if(this.cartorioSearch !== '') {
      this.dataSourceFilter = this.dataSourceFilter.filter((contratante: any) => {
        if (contratante.cartorio && contratante.cartorio.nome) {
          return contratante.cartorio.nome.toLowerCase().includes(this.cartorioSearch.toLowerCase());
        }
        return false; 
      });
    }
  }

  viewItem(element: any){
    this.router.navigate(["/contratante/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/contratante/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Contratante "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contratantesService.deleteItem(element.id);
        this.findAll();
      }
    });
  }

  cartorioSelected(event: any){
    const value = event?.value;
    this.cartorioSearch = value;
  }
}