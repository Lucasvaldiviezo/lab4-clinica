import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelUsuarioRoutingModule } from './panel-usuario-routing.module';
import { PanelUsuarioComponent } from './panel-usuario.component';
import { PerfilEspecialistaComponent } from 'src/app/components/perfil-especialista/perfil-especialista.component';
import { PerfilPacienteComponent } from 'src/app/components/perfil-paciente/perfil-paciente.component';



@NgModule({
  declarations: [
    PanelUsuarioComponent,
    PerfilEspecialistaComponent,
    PerfilPacienteComponent
  ],
  imports: [
    CommonModule,
    PanelUsuarioRoutingModule
  ]
})
export class PanelUsuarioModule { }
