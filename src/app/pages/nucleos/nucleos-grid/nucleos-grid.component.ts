import { ToolboxService } from './../../../components/toolbox/toolbox.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NucleoService } from '../../../services/nucleo.service';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-nucleos-grid',
  templateUrl: './nucleos-grid.component.html',
  styleUrl: './nucleos-grid.component.css'
})
export class NucleosGridComponent {
  displayedColumns: string[] = ['nome', 'cidade', 'bairro' , 'uf', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private service: NucleoService,
    public dialog: MatDialog
  ) {}

 
  ngOnInit(): void {
    this.findAll();
  }
  
  findAll(){
    this.service.getItems().subscribe(item => {
      if (item.length >= 0) {
        this.dataSource = item;
        this.dataSourceFilter = item;
      }
    });
  }

  addNew() {
    this.router.navigate(["/nucleos/novo"]);
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.nome.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/nucleos/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/nucleos/form/" + element.id]);
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
        this.service.deleteItem(element.id);
        this.findAll();
      }
    });
  }
}