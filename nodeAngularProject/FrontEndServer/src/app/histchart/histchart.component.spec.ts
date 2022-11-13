import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistchartComponent } from './histchart.component';

describe('HistchartComponent', () => {
  let component: HistchartComponent;
  let fixture: ComponentFixture<HistchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
