import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessoFormComponent } from './acesso-form.component';

describe('AcessoFormComponent', () => {
  let component: AcessoFormComponent;
  let fixture: ComponentFixture<AcessoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcessoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcessoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
