import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusGridComponent } from './status-grid.component';

describe('StatusGridComponent', () => {
  let component: StatusGridComponent;
  let fixture: ComponentFixture<StatusGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
