import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartorioGridComponent } from './cartorio-grid.component';

describe('CartorioGridComponent', () => {
  let component: CartorioGridComponent;
  let fixture: ComponentFixture<CartorioGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartorioGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartorioGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
