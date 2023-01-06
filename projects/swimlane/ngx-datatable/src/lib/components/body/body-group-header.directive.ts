import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableGroupHeaderTemplateDirective } from './body-group-header-template.directive';

@Directive({ selector: 'ngx-datatable-group-header' })
export class DatatableGroupHeaderDirective {
  // tslint:disable: variable-name
  static ngAcceptInputType_rowHeight: string | number | null | undefined;
  // tslint:enable: variable-name

  /**
   * Row height is required when virtual scroll is enabled.
   */
  @Input() rowHeight: number | ((group?: any, index?: number) => number) = 0; // TODO: Coerce value.

  @Input('template')
  _templateInput: TemplateRef<any> | null | undefined;

  @ContentChild(DatatableGroupHeaderTemplateDirective, { read: TemplateRef, static: true })
  _templateQuery: TemplateRef<any> | null | undefined;

  get template(): TemplateRef<any> | null | undefined {
    return this._templateInput || this._templateQuery;
  }

  /**
   * Track toggling of group visibility
   */
  @Output() toggle: EventEmitter<any> = new EventEmitter();

  /**
   * Toggle the expansion of a group
   */
  toggleExpandGroup(group: any): void {
    this.toggle.emit({
      type: 'group',
      value: group
    });
  }

  /**
   * Expand all groups
   */
  expandAllGroups(): void {
    this.toggle.emit({
      type: 'all',
      value: true
    });
  }

  /**
   * Collapse all groups
   */
  collapseAllGroups(): void {
    this.toggle.emit({
      type: 'all',
      value: false
    });
  }
}
