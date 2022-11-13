import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistRouteComponent } from './watchlist-route.component';

describe('WatchlistRouteComponent', () => {
  let component: WatchlistRouteComponent;
  let fixture: ComponentFixture<WatchlistRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchlistRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
