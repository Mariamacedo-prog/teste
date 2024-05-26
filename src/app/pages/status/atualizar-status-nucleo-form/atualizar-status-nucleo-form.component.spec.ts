import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizarStatusNucleoFormComponent } from './atualizar-status-nucleo-form.component';

describe('AtualizarStatusNucleoFormComponent', () => {
  let component: AtualizarStatusNucleoFormComponent;
  let fixture: ComponentFixture<AtualizarStatusNucleoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtualizarStatusNucleoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtualizarStatusNucleoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
