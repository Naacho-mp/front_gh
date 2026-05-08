import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsSala } from './forms-sala';

describe('FormsSala', () => {
  let component: FormsSala;
  let fixture: ComponentFixture<FormsSala>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsSala],
    }).compileComponents();

    fixture = TestBed.createComponent(FormsSala);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
