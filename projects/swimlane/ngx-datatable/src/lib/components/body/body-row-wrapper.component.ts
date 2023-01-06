import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  DoCheck,
  ChangeDetectionStrategy,
  KeyValueDiffer,
  ChangeDetectorRef,
  KeyValueDiffers
} from '@angular/core';

@Component({
  selector: 'datatable-row-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="groupHeader && groupHeader.template" class="datatable-group-header" [ngStyle]="getGroupHeaderStyle()">
      <ng-template
        *ngIf="groupHeader && groupHeader.template"
        [ngTemplateOutlet]="groupHeader.template"
        [ngTemplateOutletContext]="groupContext"
      >
      </ng-template>
    </div>
    <ng-content *ngIf="(groupHeader && groupHeader.template && expanded) || !groupHeader || !groupHeader.template">
    </ng-content>
    <div
      *ngIf="rowDetail && rowDetail.template && expanded"
      [style.height.px]="detailRowHeight"
      class="datatable-row-detail"
    >
      <ng-template
        *ngIf="rowDetail && rowDetail.template"
        [ngTemplateOutlet]="rowDetail.template"
        [ngTemplateOutletContext]="rowContext"
      >
      </ng-template>
    </div>
  `,
  host: {
    class: 'datatable-row-wrapper'
  }
})
export class DataTableRowWrapperComponent implements DoCheck {
  // tslint:disable: variable-name
  static ngAcceptInputType_innerWidth: string | number | null | undefined;
  static ngAcceptInputType_offsetX: string | number | null | undefined;
  // tslint:enable: variable-name

  @Input() innerWidth: number = 0; // TODO: Coerce value.
  @Input() rowDetail: any; // TODO: Fix type.
  @Input() groupHeader: any; // TODO: Fix type.
  @Input() offsetX: number = 0; // TODO: Coerce value.
  @Input() detailRowHeight: any; // TODO: Fix type.
  @Input() row: any; // TODO: Fix type.
  @Input() groupedRows: any; // TODO: Fix type.
  @Output() rowContextmenu = new EventEmitter<{ event: MouseEvent; row: any }>(false);

  @Input() set rowIndex(val: number) {
    this._rowIndex = val;
    this.rowContext.rowIndex = val;
    this.groupContext.rowIndex = val;
    this.cd.markForCheck();
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  @Input() set expanded(val: boolean) {
    this._expanded = val;
    this.groupContext.expanded = val;
    this.rowContext.expanded = val;
    this.cd.markForCheck();
  }

  get expanded(): boolean {
    return this._expanded;
  }

  groupContext: any = {
    // @ts-ignore
    group: this.row,
    expanded: this.expanded,
    rowIndex: this.rowIndex
  };

  rowContext: any = {
    // @ts-ignore
    row: this.row,
    expanded: this.expanded,
    rowIndex: this.rowIndex
  };

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private _expanded: boolean = false;
  private _rowIndex: number = 0;

  constructor(private cd: ChangeDetectorRef, private differs: KeyValueDiffers) {
    this.rowDiffer = differs.find({}).create();
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.row)) {
      this.rowContext.row = this.row;
      this.groupContext.group = this.row;
      this.cd.markForCheck();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.rowContextmenu.emit({ event: $event, row: this.row });
  }

  getGroupHeaderStyle(): any {
    const styles: any = {};

    styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
    styles['backface-visibility'] = 'hidden';
    styles['width'] = this.innerWidth;

    return styles;
  }
}
