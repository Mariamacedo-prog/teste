import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratanteFormComponent } from './contratante-form.component';

describe('ContratanteFormComponent', () => {
  let component: ContratanteFormComponent;
  let fixture: ComponentFixture<ContratanteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratanteFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratanteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
