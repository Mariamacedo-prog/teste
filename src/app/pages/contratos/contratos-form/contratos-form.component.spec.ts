import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosFormComponent } from './contratos-form.component';

describe('ContratosFormComponent', () => {
  let component: ContratosFormComponent;
  let fixture: ComponentFixture<ContratosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratosFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
