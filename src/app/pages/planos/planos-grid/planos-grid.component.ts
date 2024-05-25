import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { PlanosService } from '../../../services/planos.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';
@Component({
  selector: 'app-planos-grid',
  templateUrl: './planos-grid.component.html',
  styleUrl: './planos-grid.component.css'
})
export class PlanosGridComponent {
  displayedColumns: string[] = ['nome', 'valor', 'entrada' , 'numeroParcelas', 'status', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private planosService: PlanosService,
    public dialog: MatDialog
  ) {}

 
  ngOnInit(): void {
    this.findAll();
  }
  
  findAll(){
    this.planosService.getItems().subscribe(planos => {
      if (planos.length >= 0) {
        this.dataSource = planos;
        this.dataSourceFilter = planos;
      }
    });
  }

  addNew() {
    this.router.navigate(["/planos/novo"]);
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((plano: any) => plano.nome.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/planos/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/planos/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir o PLano "${element.nome}"?`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.planosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
}
