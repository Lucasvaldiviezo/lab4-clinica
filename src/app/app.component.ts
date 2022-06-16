import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fader } from './route-animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fader,
    //slider,
    //transformer,
    //stepper
  ]
})
export class AppComponent {
  title = 'lab4-clinica';
  timeLeft: number = 5;
  interval:any;
  cargarTerminada:boolean = true;
  constructor(){
  }

  ngOnInit():void{
    this.startTimer();
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else if(this.timeLeft == 0) {
        this.cargarTerminada = true;
      }
    },1000)
  }

  prepareRoute(outlet:RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
