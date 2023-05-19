import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[frontEndInternshipAssignmentDisableControl]',
})


export class DisableControlDirective {


  constructor( private ngControl : NgControl ) {
  }

  @Input() set disableControl( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    if (this.ngControl.control)
      this.ngControl.control[action]();
  }

}
