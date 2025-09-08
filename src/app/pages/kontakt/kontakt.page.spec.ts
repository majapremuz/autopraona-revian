import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KontaktPage } from './kontakt.page';

describe('KontaktPage', () => {
  let component: KontaktPage;
  let fixture: ComponentFixture<KontaktPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KontaktPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
