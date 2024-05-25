import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleosGridComponent } from './nucleos-grid.component';

describe('NucleosGridComponent', () => {
  let component: NucleosGridComponent;
  let fixture: ComponentFixture<NucleosGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NucleosGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NucleosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
