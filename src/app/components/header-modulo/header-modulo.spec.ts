import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderModulo } from './header-modulo';

describe('HeaderModulo', () => {
  let component: HeaderModulo;
  let fixture: ComponentFixture<HeaderModulo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderModulo],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderModulo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
