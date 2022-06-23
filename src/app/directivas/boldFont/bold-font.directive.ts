import { Directive,ElementRef } from '@angular/core';

@Directive({
  selector: '[appBoldFont]'
})
export class BoldFontDirective {

  constructor(private el:ElementRef) { 
    this.changeWeight(this.el);
  }
  
  changeWeight(el:ElementRef){
    this.el.nativeElement.style.fontWeight = 'bold';
  }
}
