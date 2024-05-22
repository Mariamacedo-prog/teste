import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanosFormComponent } from './planos-form.component';

describe('PlanosFormComponent', () => {
  let component: PlanosFormComponent;
  let fixture: ComponentFixture<PlanosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanosFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
