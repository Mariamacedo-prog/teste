import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoCalculoComponent } from './pagamento-calculo.component';

describe('PagamentoCalculoComponent', () => {
  let component: PagamentoCalculoComponent;
  let fixture: ComponentFixture<PagamentoCalculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagamentoCalculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagamentoCalculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
