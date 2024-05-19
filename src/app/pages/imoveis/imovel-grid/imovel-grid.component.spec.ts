import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImovelGridComponent } from './imovel-grid.component';

describe('ImovelGridComponent', () => {
  let component: ImovelGridComponent;
  let fixture: ComponentFixture<ImovelGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImovelGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImovelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
