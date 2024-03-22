import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTemplateDirective]',
})
export class TemplateDirective {
  @Input() public templateName: string;

  constructor(public template: TemplateRef<any>) {}
}
