import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { DatatableFooterDirective } from './footer.directive';
@Component({
  selector: 'datatable-footer',
  template: `
    <div
      class="datatable-footer-inner"
      [ngClass]="{ 'selected-count': selectedMessage }"
      [style.height.px]="footerHeight"
    >
      <div class="page-count" *ngIf="displayPageCount">
        <span *ngIf="selectedMessage"> {{ selectedCount?.toLocaleString() }} {{ selectedMessage }} / </span>
        {{ rowCount?.toLocaleString() }} {{ totalMessage }}
      </div>
      <ng-template
        *ngIf="footerTemplate"
        [ngTemplateOutlet]="footerTemplate.template ?? null"
        [ngTemplateOutletContext]="{
          rowCount: rowCount,
          pageSize: pageSize,
          selectedCount: selectedCount,
          curPage: curPage,
          offset: offset
        }"
      >
      </ng-template>
      <datatable-pager
        *ngIf="displayPager"
        [pagerLeftArrowIcon]="pagerLeftArrowIcon"
        [pagerRightArrowIcon]="pagerRightArrowIcon"
        [pagerPreviousIcon]="pagerPreviousIcon"
        [pagerNextIcon]="pagerNextIcon"
        [page]="curPage"
        [size]="pageSize"
        [count]="rowCount"
        [hidden]="!isVisible"
        (change)="page.emit($event)"
      >
      </datatable-pager>
    </div>
  `,
  host: {
    class: 'datatable-footer'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableFooterComponent {
  // tslint:disable: variable-name
  static ngAcceptInputType_displayPageCount: string | number | null | undefined;
  static ngAcceptInputType_displayPager: string | number | null | undefined;
  static ngAcceptInputType_selectedCount: string | number | null | undefined;
  static ngAcceptInputType_rowCount: string | number | null | undefined;
  static ngAcceptInputType_pageSize: string | number | null | undefined;
  static ngAcceptInputType_offset: string | number | null | undefined;
  // tslint:enable: variable-name

  @Input() displayPageCount: boolean = false; // TODO: Coerce value.
  @Input() displayPager: boolean = false; // TODO: Coerce value.
  @Input() footerHeight: number | null | undefined;
  @Input() rowCount: number = 0; // TODO: Coerce value.
  @Input() pageSize: number = 0; // TODO: Coerce value.
  @Input() offset: number = 0; // TODO: Coerce value.
  @Input() pagerLeftArrowIcon: string | null | undefined;
  @Input() pagerRightArrowIcon: string | null | undefined;
  @Input() pagerPreviousIcon: string | null | undefined;
  @Input() pagerNextIcon: string | null | undefined;
  @Input() totalMessage: string | null | undefined;
  @Input() footerTemplate: DatatableFooterDirective | null | undefined;

  @Input() selectedCount: number = 0; // TODO: Coerce value.
  @Input() selectedMessage: string | boolean | null | undefined;

  @Output() page: EventEmitter<any> = new EventEmitter();

  get isVisible(): boolean {
    return this.rowCount / this.pageSize > 1;
  }

  get curPage(): number {
    return this.offset + 1;
  }
}
