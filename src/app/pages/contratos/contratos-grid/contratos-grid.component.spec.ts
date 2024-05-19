import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosGridComponent } from './contratos-grid.component';

describe('ContratosGridComponent', () => {
  let component: ContratosGridComponent;
  let fixture: ComponentFixture<ContratosGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratosGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
