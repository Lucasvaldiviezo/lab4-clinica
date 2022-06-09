import { Component, OnInit } from '@angular/core';
import { AnyForUntypedForms } from '@angular/forms';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent implements OnInit {
  opcionesEspecialidad:any;
  listaEspecialistas:any;
  listaUsuarios:any;
  especialidadSeleccionada:any;
  noHayHorarios:boolean = false;
  listaHorarios:any;
  horaDesde:number = 0;
  minutoDesde:number = 0;
  horaHasta:number = 0;
  minutoHasta:number = 0;
  constructor(public fireStoreService:FirestoreService) {
    this.opcionesEspecialidad = [];
    this.listaEspecialistas = [];
    this.listaHorarios = [];
    this.fireStoreService.getCollectionWithId('Usuarios','usuarioId').subscribe(
      resp=>{
        this.listaUsuarios = resp;
        this.llenarEspecialidades();
    });
  }

  ngOnInit(): void {
  }

  llenarEspecialidades(){
    for(let i=0; i<this.listaUsuarios.length;i++){
      if(this.listaUsuarios[i].tipoUsuario == "especialista"){
        for(let j=0;j<this.listaUsuarios[i].especialidades.length;j++){
          let especialidadActual = this.listaUsuarios[i].especialidades[j];
          let existeElemento:boolean = this.opcionesEspecialidad.some((especialidad:string)=>especialidad == especialidadActual);
          if(existeElemento == false){
            this.opcionesEspecialidad.push(this.listaUsuarios[i].especialidades[j]);
          }
        }
      }
    }
  }

  elegirEspecialidad(especialidad:any){
    this.listaEspecialistas = [];
    this.especialidadSeleccionada = especialidad;
    for(let i=0; i<this.listaUsuarios.length;i++){
      if(this.listaUsuarios[i].tipoUsuario == "especialista"){
        for(let j=0;j<this.listaUsuarios[i].especialidades.length;j++){
          let doctorEspecialidad = this.listaUsuarios[i].especialidades[j];
          if(especialidad == doctorEspecialidad){
            this.listaEspecialistas.push(this.listaUsuarios[i]);
            break;
          }  
        }
      }
    }
  }

  elegirMedico(especialista:any){
    let horarioDesde:string;
    let horarioHasta:string;
    if(especialista.hasOwnProperty("horarios")) {
      for(let i=0;i<especialista.horarios.length;i++){
        if(especialista.horarios[i].especialidad == this.especialidadSeleccionada){
          horarioDesde = especialista.horarios[i].desde.split(":");
          horarioHasta = especialista.horarios[i].hasta.split(":");
        }
      }
    }else{
      this.noHayHorarios = true;
    }
   
  }
  //SEGUI EN PERFIL-ESPECIALISTA
}
