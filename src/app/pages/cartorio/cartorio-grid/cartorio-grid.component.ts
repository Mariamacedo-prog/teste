import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { CartoriosService } from '../../../services/cartorios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-cartorio-grid',
  templateUrl: './cartorio-grid.component.html',
  styleUrl: './cartorio-grid.component.css'
})
export class CartorioGridComponent {
  displayedColumns: string[] = ['nome', 'cnpj', 'cns', 'cargo', 'cidade', 'email', 'telefone', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService,
    public dialog: MatDialog,private cartoriosService: CartoriosService ) {}
  newCartorio() {
    this.router.navigate(["/cartorio/novo"]);
  }
 
  ngOnInit(): void {
   this.findAll();
  }

  findAll(){
    this.cartoriosService.getItems().subscribe(catorios => {
      if (catorios.length >= 0) {
        this.dataSource = catorios;
        this.dataSourceFilter = catorios;
      }
    });
  }
  
  search() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.cnpj.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir Cartorio "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cartoriosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
}