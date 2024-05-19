import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefeituraGridComponent } from './prefeitura-grid.component';

describe('PrefeituraGridComponent', () => {
  let component: PrefeituraGridComponent;
  let fixture: ComponentFixture<PrefeituraGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrefeituraGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrefeituraGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
