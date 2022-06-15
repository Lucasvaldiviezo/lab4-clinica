import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(public ruteo:Router) { }

  ngOnInit(): void {
  }

  inicio(){
    this.ruteo.navigateByUrl('bienvenido');
  }

}
