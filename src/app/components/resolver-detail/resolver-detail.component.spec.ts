import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolverDetailComponent } from './resolver-detail.component';

describe('ResolverDetailComponent', () => {
  let component: ResolverDetailComponent;
  let fixture: ComponentFixture<ResolverDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ResolverDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolverDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
