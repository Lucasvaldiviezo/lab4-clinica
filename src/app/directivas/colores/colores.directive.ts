import { Directive,ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appColores]'
})
export class ColoresDirective {

  constructor(private el:ElementRef) { 
    this.changeColor(el);
  }


  /*@HostListener('mouseenter') onMouseEnter() {
    this.changeColor(this.appHighlight || this.defaultColor || 'red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.changeColor('');
  }*/

  private changeColor(el:ElementRef) {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    this.el.nativeElement.style.borderColor = "#" + randomColor;
  }

}
