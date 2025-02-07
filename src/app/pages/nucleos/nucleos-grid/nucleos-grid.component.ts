import { ToolboxService } from './../../../components/toolbox/toolbox.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NucleoService } from '../../../services/nucleo.service';
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
  selector: 'app-nucleos-grid',
  templateUrl: './nucleos-grid.component.html',
  styleUrl: './nucleos-grid.component.css'
})
export class NucleosGridComponent {
  access: any = '';
  displayedColumns: string[] = ['nome', 'cidade', 'bairro' , 'uf', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  user: any = {};

  constructor(private router: Router, private service: NucleoService,
    public dialog: MatDialog, private excelService: ExcelService,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
      this.access = perms.nucleo;
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
      this.service.getItems().subscribe((items)=>{
        if (items.length >= 0) {
          this.dataSource = items;
          this.dataSourceFilter = items;
        }
      });
    }else{
      this.service.getItemsByEmpresaId(this.user.empresaId || '').subscribe((items)=>{
        if (items.length >= 0) {
          this.dataSource = items;
          this.dataSourceFilter = items;
        }
      });
    }
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
  generateExcel(): void {
    const columnsConfig: ColumnConfig[] = [
        { type: "text", width: 200, object_name: "nome", title: "Nome" },

        { type: "text", width: 150, object_name: "bairro", title: "Bairro" },
        { type: "text", width: 150, object_name: "cidade", title: "Cidade" },
        { type: "text", width: 80, object_name: "uf", title: "UF" },
        { type: "text", width: 100, object_name: "especie", title: "Espécie" },
        { type: "text", width: 100, object_name: "sigla", title: "Sigla" },

    ];

    this.excelService.exportAsExcelFile(this.dataSourceFilter, columnsConfig, 'dados');
  }
}
