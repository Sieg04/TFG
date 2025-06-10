import { TestBed } from '@angular/core/testing';

import { UruguayDataService } from './uruguay-data.service';

describe('UruguayDataService', () => {
  let service: UruguayDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UruguayDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
