import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { StatusService } from '../../../services/status.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-status-grid',
  templateUrl: './status-grid.component.html',
  styleUrl: './status-grid.component.css'
})
export class StatusGridComponent {
  displayedColumns: string[] = ['nome', 'descricao', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private service: StatusService,
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
    this.router.navigate(["/status/novo"]);
  }

  updateAllByNucleo(){
    this.router.navigate(["/status/atualizar/todos"]);
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.descricao.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/status/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/status/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        text: `Tem certeza que deseja excluir o Status "${element.nome}"?`,
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
