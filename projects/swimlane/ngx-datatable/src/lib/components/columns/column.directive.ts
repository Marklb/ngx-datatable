import { Directive, TemplateRef, ContentChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataTableColumnHeaderDirective } from './column-header.directive';
import { DataTableColumnCellDirective } from './column-cell.directive';
import { DataTableColumnCellTreeToggle } from './tree.directive';
import { ColumnChangesService } from '../../services/column-changes.service';
import { TableColumnProp } from '../../types/table-column.type';

@Directive({ selector: 'ngx-datatable-column' })
export class DataTableColumnDirective implements OnChanges {
  // tslint:disable: variable-name
  static ngAcceptInputType_flexGrow: string | number | null | undefined;
  static ngAcceptInputType_resizeable: string | boolean | null | undefined;
  static ngAcceptInputType_sortable: string | boolean | null | undefined;
  static ngAcceptInputType_draggable: string | boolean | null | undefined;
  static ngAcceptInputType_canAutoResize: string | boolean | null | undefined;
  static ngAcceptInputType_minWidth: string | number | null | undefined;
  static ngAcceptInputType_width: string | number | null | undefined;
  static ngAcceptInputType_maxWidth: string | number | null | undefined;
  static ngAcceptInputType_checkboxable: string | boolean | null | undefined;
  static ngAcceptInputType_headerCheckboxable: string | boolean | null | undefined;
  static ngAcceptInputType_isTreeColumn: string | boolean | null | undefined;
  static ngAcceptInputType_treeLevelIndent: string | number | null | undefined;
  // tslint:enable: variable-name

  @Input() name: string | null | undefined;
  @Input() prop: TableColumnProp | null | undefined;
  @Input() frozenLeft: any; // TODO: Coerce value.
  @Input() frozenRight: any; // TODO: Coerce value.
  @Input() flexGrow: number | null | undefined; // TODO: Coerce value.
  @Input() resizeable: boolean | undefined; // TODO: Coerce value.
  @Input() comparator: any | null | undefined; // TODO: Fix type.
  @Input() pipe: any | null | undefined; // TODO: Fix type.
  @Input() sortable: boolean | undefined; // TODO: Coerce value.
  @Input() draggable: boolean | undefined; // TODO: Coerce value.
  @Input() canAutoResize: boolean | undefined; // TODO: Coerce value.
  @Input() minWidth: number | null | undefined; // TODO: Coerce value.
  @Input() width: number | null | undefined; // TODO: Coerce value.
  @Input() maxWidth: number | null | undefined; // TODO: Coerce value.
  @Input() checkboxable: boolean = false; // TODO: Coerce value.
  @Input() headerCheckboxable: boolean = false; // TODO: Coerce value.
  @Input() headerClass: string | ((data: any) => string | any) | null | undefined;
  @Input() cellClass: string | ((data: any) => string | any) | null | undefined;
  @Input() isTreeColumn: boolean = false; // TODO: Coerce value.
  @Input() treeLevelIndent: number | null | undefined; // TODO: Coerce value.
  @Input() summaryFunc: ((cells: any[]) => any) | null | undefined;
  @Input() summaryTemplate: TemplateRef<any> | null | undefined;

  @Input('cellTemplate')
  _cellTemplateInput: TemplateRef<any> | null | undefined;

  @ContentChild(DataTableColumnCellDirective, { read: TemplateRef, static: true })
  _cellTemplateQuery: TemplateRef<any> | null | undefined;

  get cellTemplate(): TemplateRef<any> | null | undefined {
    return this._cellTemplateInput || this._cellTemplateQuery;
  }

  @Input('headerTemplate')
  _headerTemplateInput: TemplateRef<any> | null | undefined;

  @ContentChild(DataTableColumnHeaderDirective, { read: TemplateRef, static: true })
  _headerTemplateQuery: TemplateRef<any> | null | undefined;

  get headerTemplate(): TemplateRef<any> | null | undefined {
    return this._headerTemplateInput || this._headerTemplateQuery;
  }

  @Input('treeToggleTemplate')
  _treeToggleTemplateInput: TemplateRef<any> | null | undefined;

  @ContentChild(DataTableColumnCellTreeToggle, { read: TemplateRef, static: true })
  _treeToggleTemplateQuery: TemplateRef<any> | null | undefined;

  get treeToggleTemplate(): TemplateRef<any> | null | undefined {
    return this._treeToggleTemplateInput || this._treeToggleTemplateQuery;
  }

  private isFirstChange = true;

  constructor(private columnChangesService: ColumnChangesService) {}

  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.columnChangesService.onInputChange();
    }
  }
}
