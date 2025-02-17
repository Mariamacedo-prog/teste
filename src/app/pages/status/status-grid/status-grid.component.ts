import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { StatusService } from '../../../services/status.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { ExcelService } from '../../../services/utils/excel.service';
import { AuthService } from '../../../auth/auth.service';

interface ColumnConfig {
  type: string;
  width: number;
  object_name: string;
  title: string;
}

@Component({
  selector: 'app-status-grid',
  templateUrl: './status-grid.component.html',
  styleUrl: './status-grid.component.css'
})
export class StatusGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'descricao', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  user: any = {};

  constructor(private router: Router, private toolboxService: ToolboxService, private service: StatusService,
    public dialog: MatDialog, private excelService: ExcelService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.status;
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    if(this.access == 'restrito'){
      this.router.navigate(["/usuario/lista"]);
    }

    this.findAll();
  }

  findAll(){
    if (this.user.empresaPrincipal) {
      this.service.getItems().subscribe(item => {
        if (item.length >= 0) {
          this.dataSource = item;
          this.dataSourceFilter = item;
        }
      });
    }else{
      this.service.getItemsByEmpresaId(this.user.empresaId || '').subscribe(item => {
        if (item.length >= 0) {
          this.dataSource = item;
          this.dataSourceFilter = item;
        }
      });
    }
    
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
  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 100, object_name: "nome", title: "Nome" },
        { type: "text", width: 100, object_name: "descricao", title: "Descricao" },

    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}
