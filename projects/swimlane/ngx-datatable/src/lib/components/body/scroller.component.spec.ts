import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { ScrollerComponent } from './scroller.component';

describe('ScrollerComponent', () => {
  let fixture: ComponentFixture<ScrollerComponent>;
  let component: ScrollerComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScrollerComponent],
      providers: [
        {
          provide: ScrollbarHelper,
          useValue: {
            onInitScroller: jasmine.createSpy('onInitScroller'),
            onDestroyScroller: jasmine.createSpy('onDestroyScroller'),
            setOffset: jasmine.createSpy('setOffset')
          }
        }
      ]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ScrollerComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('no scrollbar', () => {
    beforeEach(() => {
      component.scrollbarV = false;
      component.scrollbarH = false;
      fixture.detectChanges();
    });

    it('should not init scroller', () => {
      expect(TestBed.inject(ScrollbarHelper).onInitScroller).not.toHaveBeenCalled();
    });
  });

  describe('vertical scrollbar', () => {
    beforeEach(() => {
      component.scrollbarV = true;
      component.scrollbarH = false;
      fixture.detectChanges();
    });

    it('should init scroller', () => {
      expect(TestBed.inject(ScrollbarHelper).onInitScroller).toHaveBeenCalled();
    });
  });

  describe('horizontal scrollbar', () => {
    beforeEach(() => {
      component.scrollbarV = false;
      component.scrollbarH = true;
      fixture.detectChanges();
    });

    it('should not init scroller', () => {
      expect(TestBed.inject(ScrollbarHelper).onInitScroller).toHaveBeenCalled();
    });
  });
});
