import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioGridComponent } from './usuario-grid.component';

describe('UsuarioGridComponent', () => {
  let component: UsuarioGridComponent;
  let fixture: ComponentFixture<UsuarioGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuarioGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuarioGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
