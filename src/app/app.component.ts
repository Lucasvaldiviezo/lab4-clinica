import { Component } from '@angular/core';
import { timer } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
        console.log(this.timeLeft);
      } else if(this.timeLeft == 0) {
        this.cargarTerminada = true;
      }
    },1000)
  }
}
