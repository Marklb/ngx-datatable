import {
  Component,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  Renderer2,
  NgZone,
  OnInit,
  OnDestroy,
  HostBinding,
  ChangeDetectionStrategy
} from '@angular/core';

import { MouseEvent } from '../../events';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';

@Component({
  selector: 'datatable-scroller',
  template: ` <ng-content></ng-content> `,
  host: {
    class: 'datatable-scroll'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerComponent implements OnInit, OnDestroy {
  // tslint:disable: variable-name
  static ngAcceptInputType_scrollbarV: string | boolean | null | undefined;
  static ngAcceptInputType_scrollbarH: string | boolean | null | undefined;
  // tslint:enable: variable-name

  @Input() scrollbarV: boolean = false; // TODO: Coerce value.
  @Input() scrollbarH: boolean = false; // TODO: Coerce value.

  @HostBinding('style.height.px')
  @Input()
  scrollHeight: number | null | undefined;

  @HostBinding('style.width.px')
  @Input()
  scrollWidth: number | null | undefined;

  @Output() scroll: EventEmitter<any> = new EventEmitter();

  scrollYPos: number = 0;
  scrollXPos: number = 0;
  prevScrollYPos: number = 0;
  prevScrollXPos: number = 0;
  element: any;
  parentElement: any;
  onScrollListener: any;

  private _scrollEventListener: any = null;

  constructor(
    private ngZone: NgZone,
    element: ElementRef,
    private renderer: Renderer2,
    private scrollHelper: ScrollbarHelper
  ) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    // manual bind so we don't always listen
    if (this.scrollbarV || this.scrollbarH) {
      const renderer = this.renderer;
      this.parentElement = renderer.parentNode(renderer.parentNode(this.element));
      this.scrollHelper.onInitScroller(this);
    }
  }

  ngOnDestroy(): void {
    this.scrollHelper.onDestroyScroller(this);
  }

  setOffset(offsetY: number): void {
    if (this.parentElement) {
      this.scrollHelper.setOffset(this, offsetY);
    }
  }

  onScrolled(event: MouseEvent): void {
    const dom: Element = <Element>event.currentTarget;
    requestAnimationFrame(() => {
      this.scrollYPos = dom.scrollTop;
      this.scrollXPos = dom.scrollLeft;
      this.updateOffset();
    });
  }

  updateOffset(): void {
    let direction: string;
    if (this.scrollYPos < this.prevScrollYPos) {
      direction = 'down';
    } else if (this.scrollYPos > this.prevScrollYPos) {
      direction = 'up';
    }

    this.scroll.emit({
      // @ts-ignore
      direction,
      scrollYPos: this.scrollYPos,
      scrollXPos: this.scrollXPos
    });

    this.prevScrollYPos = this.scrollYPos;
    this.prevScrollXPos = this.scrollXPos;
  }
}
