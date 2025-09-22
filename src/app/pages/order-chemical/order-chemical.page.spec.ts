import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderChemicalPage } from './order-chemical.page';

describe('OrderChemicalPage', () => {
  let component: OrderChemicalPage;
  let fixture: ComponentFixture<OrderChemicalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderChemicalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
