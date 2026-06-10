import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilidadDocente } from './disponibilidad-docente';

describe('DisponibilidadDocente', () => {
  let component: DisponibilidadDocente;
  let fixture: ComponentFixture<DisponibilidadDocente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponibilidadDocente],
    }).compileComponents();

    fixture = TestBed.createComponent(DisponibilidadDocente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
