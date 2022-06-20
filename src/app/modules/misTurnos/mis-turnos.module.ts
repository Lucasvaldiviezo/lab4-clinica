import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos.component';
import { TurnosPacienteComponent } from 'src/app/components/turnos-paciente/turnos-paciente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnoAdminComponent } from 'src/app/components/turno-admin/turno-admin.component';
import { TurnoEspecialistaComponent } from 'src/app/components/turno-especialista/turno-especialista.component';
import { HistoriaClinicaComponent } from 'src/app/components/historia-clinica/historia-clinica.component';


@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosPacienteComponent,
    TurnoAdminComponent,
    TurnoEspecialistaComponent,
    HistoriaClinicaComponent
  ],
  imports: [
    CommonModule,
    MisTurnosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MisTurnosModule { }
