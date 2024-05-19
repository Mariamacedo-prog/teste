import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolboxService {
  private tooltipSubject = new Subject<any>();

  tooltip$ = this.tooltipSubject.asObservable();

  showTooltip(tipo: string, descricao: string, titulo: string) {
    this.tooltipSubject.next({ tipo, descricao, titulo });
  }
}
