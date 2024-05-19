import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaPagamentoGridComponent } from './venda-pagamento-grid.component';

describe('VendaPagamentoGridComponent', () => {
  let component: VendaPagamentoGridComponent;
  let fixture: ComponentFixture<VendaPagamentoGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendaPagamentoGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendaPagamentoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
