import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CijenikPage } from './cijenik.page';

describe('CijenikPage', () => {
  let component: CijenikPage;
  let fixture: ComponentFixture<CijenikPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CijenikPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
