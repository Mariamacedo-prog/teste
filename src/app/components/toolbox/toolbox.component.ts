import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolboxService } from './toolbox.service';
interface ToolboxType {
  descricao: string;
  titulo:string;
  tipo: string;
}

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})
export class ToolboxComponent implements OnInit, OnDestroy {
  tooltip: {
    info: ToolboxType,
    closeTooltip: boolean
  } = {
    info: { tipo: '', descricao: '', titulo: '' },
    closeTooltip: false
  };
  
  subscription!: Subscription;

  constructor(private toolboxService: ToolboxService) {}

  ngOnInit(): void {
    this.subscription = this.toolboxService.tooltip$.subscribe(
      (tooltip) => {
        this.tooltip.info.tipo = tooltip.tipo;
        this.tooltip.info.descricao = tooltip.descricao;
        this.tooltip.info.titulo = tooltip.titulo;

        this.tooltip.closeTooltip = false;
        setTimeout(() => {
          this.tooltip.closeTooltip  = true;
        }, 5000);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
