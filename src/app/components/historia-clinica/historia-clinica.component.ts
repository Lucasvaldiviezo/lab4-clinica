import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  @Input () turnoActual:any;
  public formHistoriaClinica: FormGroup;
  datoDinamico1:any;
  datoDinamico2:any;
  datoDinamico3:any;
  valorDinamico1:any;
  valorDinamico2:any;
  valorDinamico3:any;
  constructor(private fb: FormBuilder,) { 
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
    let historiaClinica = {
      altura: this.formHistoriaClinica.getRawValue().altura,
      peso: this.formHistoriaClinica.getRawValue().peso,
      temperatura: this.formHistoriaClinica.getRawValue().temperatura,
      presion: this.formHistoriaClinica.getRawValue().presion,
      [this.datoDinamico1]: this.valorDinamico1,
      [this.datoDinamico2]: this.valorDinamico2,
      [this.datoDinamico3]: this.valorDinamico3,
    }
  }

}
