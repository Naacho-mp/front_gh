import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarDialog } from './confirmar-dialog';

describe('ConfirmarDialog', () => {
  let component: ConfirmarDialog;
  let fixture: ComponentFixture<ConfirmarDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
