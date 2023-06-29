import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorMarketComponent } from './requestor-market.component';

describe('RequestorMarketComponent', () => {
  let component: RequestorMarketComponent;
  let fixture: ComponentFixture<RequestorMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestorMarketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestorMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
