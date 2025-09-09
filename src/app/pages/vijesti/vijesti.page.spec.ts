import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VijestiPage } from './vijesti.page';

describe('VijestiPage', () => {
  let component: VijestiPage;
  let fixture: ComponentFixture<VijestiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VijestiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
