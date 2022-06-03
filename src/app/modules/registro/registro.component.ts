import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroEspecialista = false;
  registroPaciente = false;
  ngOnInit(): void {
    
  }

  ngOnChanges(){
    
  }

  mostrarEspecialista(){
    this.registroEspecialista = true;
    this.registroPaciente = false;
  }

  mostrarPaciente(){
    this.registroEspecialista = false;
    this.registroPaciente = true;
  }

}
