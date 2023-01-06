import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { Observable, Subscription, fromEvent, Subject } from 'rxjs';
import { MouseEvent } from '../events';
import { takeUntil, auditTime } from 'rxjs/operators';

@Directive({
  selector: '[resizeable]',
  host: {
    '[class.resizeable]': 'resizeEnabled'
  }
})
export class ResizeableDirective implements OnDestroy, AfterViewInit {
  // tslint:disable: variable-name
  static ngAcceptInputType_minWidth: string | number | null | undefined;
  static ngAcceptInputType_maxWidth: string | number | null | undefined;
  // tslint:enable: variable-name

  @Input() resizeEnabled: boolean = true;
  @Input() minWidth: number = 0;
  @Input() maxWidth: number = 0;

  @Output() resize: EventEmitter<any> = new EventEmitter();
  @Output() resizingMove: EventEmitter<any> = new EventEmitter();

  _resizingRequest = new Subject<any>();

  element: HTMLElement;
  subscription?: Subscription;
  resizing: boolean = false;
  private resizeHandle?: HTMLElement;

  constructor(element: ElementRef, private renderer: Renderer2) {
    this.element = element.nativeElement;

    this._resizingRequest.pipe(auditTime(0)).subscribe(v => this.resizingMove.emit(v));
  }

  ngAfterViewInit(): void {
    const renderer2 = this.renderer;
    this.resizeHandle = renderer2.createElement('span');
    if (this.resizeEnabled) {
      renderer2.addClass(this.resizeHandle, 'resize-handle');
    } else {
      renderer2.addClass(this.resizeHandle, 'resize-handle--not-resizable');
    }
    renderer2.appendChild(this.element, this.resizeHandle);
  }

  ngOnDestroy(): void {
    this._destroySubscription();
    if (this.renderer.destroyNode) {
      this.renderer.destroyNode(this.resizeHandle);
    } else if (this.resizeHandle) {
      this.renderer.removeChild(this.renderer.parentNode(this.resizeHandle), this.resizeHandle);
    }
  }

  onMouseup(): void {
    this.resizing = false;

    if (this.subscription && !this.subscription.closed) {
      this._destroySubscription();
      this.resize.emit(this.element.clientWidth);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    const isHandle = (<HTMLElement>event.target).classList.contains('resize-handle');
    const initialWidth = this.element.clientWidth;
    const mouseDownScreenX = event.screenX;

    if (isHandle) {
      event.stopPropagation();
      this.resizing = true;

      const mouseup = fromEvent<MouseEvent>(document, 'mouseup');
      this.subscription = mouseup.subscribe((ev: MouseEvent) => this.onMouseup());

      const mouseMoveSub = fromEvent<MouseEvent>(document, 'mousemove')
        .pipe(takeUntil(mouseup))
        .subscribe((e: MouseEvent) => this.move(e, initialWidth, mouseDownScreenX));

      this.subscription.add(mouseMoveSub);
    }
  }

  move(event: MouseEvent, initialWidth: number, mouseDownScreenX: number): void {
    const movementX = event.screenX - mouseDownScreenX;
    const newWidth = initialWidth + movementX;

    const overMinWidth = !this.minWidth || newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || newWidth <= this.maxWidth;

    if (overMinWidth && underMaxWidth) {
      this.element.style.width = `${newWidth}px`;
    }

    this._resizingRequest.next(newWidth);
  }

  private _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
