import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRezervedPage } from './date-rezerved.page';

describe('DateRezervedPage', () => {
  let component: DateRezervedPage;
  let fixture: ComponentFixture<DateRezervedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRezervedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
