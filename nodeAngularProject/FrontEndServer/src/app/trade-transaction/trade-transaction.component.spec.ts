import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeTransactionComponent } from './trade-transaction.component';

describe('TradeTransactionComponent', () => {
  let component: TradeTransactionComponent;
  let fixture: ComponentFixture<TradeTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
