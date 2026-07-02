import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictoDialog } from './conflicto-dialog';

describe('ConflictoDialog', () => {
  let component: ConflictoDialog;
  let fixture: ComponentFixture<ConflictoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictoDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ConflictoDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
