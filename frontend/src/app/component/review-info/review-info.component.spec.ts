import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ReviewInfoComponent } from './review-info.component';

describe('ReviewInfoComponent', () => {
  let component: ReviewInfoComponent;
  let fixture: ComponentFixture<ReviewInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewInfoComponent, ToolbarComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatIconModule,
        MatToolbarModule,
        BrowserAnimationsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
