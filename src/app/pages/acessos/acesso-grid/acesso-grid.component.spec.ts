import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessoGridComponent } from './acesso-grid.component';

describe('AcessoGridComponent', () => {
  let component: AcessoGridComponent;
  let fixture: ComponentFixture<AcessoGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcessoGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcessoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
