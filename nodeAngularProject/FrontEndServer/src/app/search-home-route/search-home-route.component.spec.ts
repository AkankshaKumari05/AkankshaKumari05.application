import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchHomeRouteComponent } from './search-home-route.component';

describe('SearchHomeRouteComponent', () => {
  let component: SearchHomeRouteComponent;
  let fixture: ComponentFixture<SearchHomeRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchHomeRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHomeRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
