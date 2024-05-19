import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefeituraFormComponent } from './prefeitura-form.component';

describe('PrefeituraFormComponent', () => {
  let component: PrefeituraFormComponent;
  let fixture: ComponentFixture<PrefeituraFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrefeituraFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrefeituraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
