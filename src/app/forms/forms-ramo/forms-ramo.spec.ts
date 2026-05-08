import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsRamo } from './forms-ramo';

describe('FormsRamo', () => {
  let component: FormsRamo;
  let fixture: ComponentFixture<FormsRamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsRamo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormsRamo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
