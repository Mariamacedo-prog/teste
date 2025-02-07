import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasGridComponent } from './empresas-grid.component';

describe('EmpresasGridComponent', () => {
  let component: EmpresasGridComponent;
  let fixture: ComponentFixture<EmpresasGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresasGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpresasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
