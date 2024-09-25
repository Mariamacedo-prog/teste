import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarDocumentoGridComponent } from './gerenciar-documento-grid.component';

describe('GerenciarDocumentoGridComponent', () => {
  let component: GerenciarDocumentoGridComponent;
  let fixture: ComponentFixture<GerenciarDocumentoGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarDocumentoGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarDocumentoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
