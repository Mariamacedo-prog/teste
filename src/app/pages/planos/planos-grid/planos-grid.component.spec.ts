import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanosGridComponent } from './planos-grid.component';

describe('PlanosGridComponent', () => {
  let component: PlanosGridComponent;
  let fixture: ComponentFixture<PlanosGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanosGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
