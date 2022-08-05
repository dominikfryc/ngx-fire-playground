import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardDetailComponent } from './standard-detail.component';

describe('StandardDetailComponent', () => {
  let component: StandardDetailComponent;
  let fixture: ComponentFixture<StandardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StandardDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
