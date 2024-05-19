import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioGridComponent } from './funcionario-grid.component';

describe('FuncionarioGridComponent', () => {
  let component: FuncionarioGridComponent;
  let fixture: ComponentFixture<FuncionarioGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuncionarioGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuncionarioGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
