import { Input, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DataTableFooterTemplateDirective } from './footer-template.directive';

@Directive({ selector: 'ngx-datatable-footer' })
export class DatatableFooterDirective {
  @Input() footerHeight: number | null | undefined;
  @Input() totalMessage: string | null | undefined;
  @Input() selectedMessage: string | boolean | null | undefined;
  @Input() pagerLeftArrowIcon: string | null | undefined;
  @Input() pagerRightArrowIcon: string | null | undefined;
  @Input() pagerPreviousIcon: string | null | undefined;
  @Input() pagerNextIcon: string | null | undefined;

  @Input('template')
  _templateInput: TemplateRef<any> | null | undefined;

  @ContentChild(DataTableFooterTemplateDirective, { read: TemplateRef })
  _templateQuery: TemplateRef<any> | null | undefined;

  get template(): TemplateRef<any> | null | undefined {
    return this._templateInput || this._templateQuery;
  }
}
