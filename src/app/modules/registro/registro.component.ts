import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroEspecialista = false;
  registroPaciente = true;
  ngOnInit(): void {
    
  }

  ngOnChanges(){
    
  }

  onChange(tipoRegistro:any) {
    let opcion:string = tipoRegistro.target.value;
    if(opcion == "paciente"){
      this.registroPaciente = true;
      this.registroEspecialista = false;
    }else if(opcion == "especialista"){
      this.registroEspecialista = true;
      this.registroPaciente = false;
    }
  }

}
