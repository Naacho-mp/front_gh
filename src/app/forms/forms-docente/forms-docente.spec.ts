import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocenteComponent} from './forms-docente';

describe('FormDocente', () => {
  let component: FormDocenteComponent;
  let fixture: ComponentFixture<FormDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDocenteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDocenteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
