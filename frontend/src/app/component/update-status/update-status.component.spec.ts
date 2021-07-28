import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateStatusComponent } from './update-status.component';

describe('UpdateStatusComponent', () => {
  let component: UpdateStatusComponent;
  let fixture: ComponentFixture<UpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateStatusComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
