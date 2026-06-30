import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilidadDocenteComponent } from './disponibilidad-docente';

describe('DisponibilidadDocente', () => {
  let component: DisponibilidadDocenteComponent;
  let fixture: ComponentFixture<DisponibilidadDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponibilidadDocenteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisponibilidadDocenteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
