import { Component, Input, OnChanges, PipeTransform, TemplateRef } from '@angular/core';

export interface ISummaryColumn {
  summaryFunc?: (cells: any[]) => any;
  summaryTemplate?: TemplateRef<any>;

  prop: string;
  pipe?: PipeTransform;
}

function defaultSumFunc(cells: any[]): any {
  const cellsWithValues = cells.filter(cell => !!cell);

  if (!cellsWithValues.length) {
    return null;
  }
  if (cellsWithValues.some(cell => typeof cell !== 'number')) {
    return null;
  }

  return cellsWithValues.reduce((res, cell) => res + cell);
}

function noopSumFunc(cells: any[]): void {
  return null as unknown as void; // TODO: Fix type.
}

@Component({
  selector: 'datatable-summary-row',
  template: `
    <datatable-body-row
      *ngIf="summaryRow && _internalColumns"
      tabindex="-1"
      [innerWidth]="$any(innerWidth)"
      [offsetX]="$any(offsetX)"
      [columns]="_internalColumns"
      [rowHeight]="rowHeight"
      [row]="summaryRow"
      [rowIndex]="-1"
    >
    </datatable-body-row>
  `,
  host: {
    class: 'datatable-summary-row'
  }
})
export class DataTableSummaryRowComponent implements OnChanges {
  // tslint:disable: variable-name
  static ngAcceptInputType_rowHeight: string | number | null | undefined;
  static ngAcceptInputType_offsetX: string | number | null | undefined;
  static ngAcceptInputType_innerWidth: string | number | null | undefined;
  // tslint:enable: variable-name

  @Input() rows: any[] | undefined;
  @Input() columns: ISummaryColumn[] | undefined;

  @Input() rowHeight: number | undefined; // TODO: Coerce value.
  @Input() offsetX: number | undefined; // TODO: Coerce value.
  @Input() innerWidth: number | undefined; // TODO: Coerce value.

  _internalColumns: ISummaryColumn[] | undefined;
  summaryRow: any = {};

  ngOnChanges() {
    if (!this.columns || !this.rows) {
      return;
    }
    this.updateInternalColumns();
    this.updateValues();
  }

  private updateInternalColumns() {
    this._internalColumns = this.columns!.map(col => ({
      ...col,
      cellTemplate: col.summaryTemplate
    }));
  }

  private updateValues() {
    this.summaryRow = {};

    this.columns!.filter((col: any) => !col.summaryTemplate).forEach((col: any) => {
      const cellsFromSingleColumn = this.rows!.map(row => row[col.prop]);
      const sumFunc = this.getSummaryFunction(col);

      this.summaryRow[col.prop] = col.pipe
        ? col.pipe.transform(sumFunc(cellsFromSingleColumn))
        : sumFunc(cellsFromSingleColumn);
    });
  }

  private getSummaryFunction(column: ISummaryColumn): (a: any[]) => any {
    if (column.summaryFunc === undefined) {
      return defaultSumFunc;
    } else if (column.summaryFunc === null) {
      return noopSumFunc;
    } else {
      return column.summaryFunc;
    }
  }
}
