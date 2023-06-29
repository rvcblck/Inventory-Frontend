import { TestBed } from '@angular/core/testing';

import { SupplierGuard } from './supplier.guard';

describe('SupplierGuard', () => {
  let guard: SupplierGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SupplierGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
