import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolverListComponent } from './resolver-list.component';

describe('ResolverListComponent', () => {
  let component: ResolverListComponent;
  let fixture: ComponentFixture<ResolverListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ResolverListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
