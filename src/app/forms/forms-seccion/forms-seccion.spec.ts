import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsSeccion } from './forms-seccion';

describe('FormsSeccion', () => {
  let component: FormsSeccion;
  let fixture: ComponentFixture<FormsSeccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsSeccion],
    }).compileComponents();

    fixture = TestBed.createComponent(FormsSeccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
