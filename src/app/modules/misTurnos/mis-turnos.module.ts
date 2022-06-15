import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos.component';
import { TurnosPacienteComponent } from 'src/app/components/turnos-paciente/turnos-paciente.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosPacienteComponent
  ],
  imports: [
    CommonModule,
    MisTurnosRoutingModule,
    FormsModule
  ]
})
export class MisTurnosModule { }
