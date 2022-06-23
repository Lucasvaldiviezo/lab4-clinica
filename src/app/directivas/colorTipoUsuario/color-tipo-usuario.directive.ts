import { Directive,ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appColorTipoUsuario]'
})
export class ColorTipoUsuarioDirective {
  @Input() appColorTipoUsuario:string = "";
  constructor(private el:ElementRef) { 
  }
  ngOnInit(){
    this.changeColor(this.el);
  }
  private changeColor(el:ElementRef) {
    switch(this.appColorTipoUsuario){
      case 'admin':
        this.el.nativeElement.style.color = '#d15454';
        break;
      case 'paciente':
        this.el.nativeElement.style.color = '#4fb4c2';
        break;
      case 'especialista':
        this.el.nativeElement.style.color = '#54c77a'; 
        break;
    }
   
  }
}
