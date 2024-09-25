import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarDocumentoFormComponent } from './gerenciar-documento-form.component';

describe('GerenciarDocumentoFormComponent', () => {
  let component: GerenciarDocumentoFormComponent;
  let fixture: ComponentFixture<GerenciarDocumentoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarDocumentoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarDocumentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
