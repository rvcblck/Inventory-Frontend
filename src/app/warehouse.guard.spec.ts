import { TestBed } from '@angular/core/testing';

import { WarehouseGuard } from './warehouse.guard';

describe('WarehouseGuard', () => {
  let guard: WarehouseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WarehouseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
