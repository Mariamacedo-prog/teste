import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorGridComponent } from './vendedor-grid.component';

describe('VendedorGridComponent', () => {
  let component: VendedorGridComponent;
  let fixture: ComponentFixture<VendedorGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendedorGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendedorGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
