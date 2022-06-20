import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  @Input () turnoActual:any;
  @Output() cerrarVentana:EventEmitter<any>= new EventEmitter<any>();
  public formHistoriaClinica: FormGroup;
  datoDinamico1:string ="";
  datoDinamico2:string="";
  datoDinamico3:string="";
  valorDinamico1:string="";
  valorDinamico2:string="";
  valorDinamico3:string="";
  mostrarError:boolean = false;
  constructor(private fb: FormBuilder, public fireStoreService:FirestoreService) { 
    this.formHistoriaClinica = this.fb.group({
      'altura': ['', [Validators.required]],
      'peso': ['', [Validators.required]],
      'temperatura': ['', [Validators.required]],
      'presion': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }


  cargarHistoria(){
    if(this.datoDinamico1 != "" 
    && this.datoDinamico2 != ""
    && this.datoDinamico3 != ""
    && this.valorDinamico1 != ""
    && this.valorDinamico2 != ""
    && this.valorDinamico3 != ""){
      let historiaClinica = {
        paciente: this.turnoActual.paciente,
        especialista: this.turnoActual.especialista,
        dia: this.turnoActual.dia,
        horario: this.turnoActual.horario,
        especialidad: this.turnoActual.especialidad,
        altura: this.formHistoriaClinica.getRawValue().altura + " mts",
        peso: this.formHistoriaClinica.getRawValue().peso + " kg",
        temperatura: this.formHistoriaClinica.getRawValue().temperatura + "°",
        presion: this.formHistoriaClinica.getRawValue().presion,
        [this.datoDinamico1]: this.valorDinamico1,
        [this.datoDinamico2]: this.valorDinamico2,
        [this.datoDinamico3]: this.valorDinamico3,
      }
      this.fireStoreService.agregarHistoriaClinica("Historias",historiaClinica);
      this.formHistoriaClinica.reset();
      this.cerrarVentana.emit(false);
    }else{
      this.mostrarError = true;
    }
    
  }

  cerrarError(){
    this.mostrarError = false;
  }

}
