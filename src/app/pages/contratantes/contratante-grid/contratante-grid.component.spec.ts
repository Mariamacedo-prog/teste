import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratanteGridComponent } from './contratante-grid.component';

describe('ContratanteGridComponent', () => {
  let component: ContratanteGridComponent;
  let fixture: ComponentFixture<ContratanteGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratanteGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratanteGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
