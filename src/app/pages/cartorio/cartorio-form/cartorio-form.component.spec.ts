import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartorioFormComponent } from './cartorio-form.component';

describe('CartorioFormComponent', () => {
  let component: CartorioFormComponent;
  let fixture: ComponentFixture<CartorioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartorioFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
