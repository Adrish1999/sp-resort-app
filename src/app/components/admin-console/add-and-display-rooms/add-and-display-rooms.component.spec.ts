import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAndDisplayRoomsComponent } from './add-and-display-rooms.component';

describe('AddAndDisplayRoomsComponent', () => {
  let component: AddAndDisplayRoomsComponent;
  let fixture: ComponentFixture<AddAndDisplayRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAndDisplayRoomsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAndDisplayRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
