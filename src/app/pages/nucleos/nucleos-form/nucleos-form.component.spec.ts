import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleosFormComponent } from './nucleos-form.component';

describe('NucleosFormComponent', () => {
  let component: NucleosFormComponent;
  let fixture: ComponentFixture<NucleosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NucleosFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NucleosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
