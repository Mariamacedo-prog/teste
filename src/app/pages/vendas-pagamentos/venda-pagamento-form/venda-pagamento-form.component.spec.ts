import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaPagamentoFormComponent } from './venda-pagamento-form.component';

describe('VendaPagamentoFormComponent', () => {
  let component: VendaPagamentoFormComponent;
  let fixture: ComponentFixture<VendaPagamentoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendaPagamentoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendaPagamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
