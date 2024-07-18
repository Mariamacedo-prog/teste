import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

interface ColumnConfig {
  type: string;
  width: number;
  object_name: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], columnsConfig: ColumnConfig[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], {header: columnsConfig.map(col => col.title)});
    
    json.forEach(item => {
      const rowData: any = {};
      columnsConfig.forEach(col => {
        const value = this.getValueByPath(item, col.object_name);
        rowData[col.title] = value;
      });
      XLSX.utils.sheet_add_json(worksheet, [rowData], {skipHeader: true, origin: -1});
    });

    worksheet['!cols'] = columnsConfig.map(col => ({ wpx: col.width }));

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const link = document.createElement('a');
    const url = URL.createObjectURL(data);
    link.href = url;
    link.download = fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
    link.click();
    URL.revokeObjectURL(url);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';