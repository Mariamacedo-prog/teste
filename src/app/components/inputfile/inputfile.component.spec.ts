import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputfileComponent } from './inputfile.component';

describe('InputfileComponent', () => {
  let component: InputfileComponent;
  let fixture: ComponentFixture<InputfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
