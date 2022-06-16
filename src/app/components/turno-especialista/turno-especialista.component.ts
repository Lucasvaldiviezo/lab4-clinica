import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-turno-especialista',
  templateUrl: './turno-especialista.component.html',
  styleUrls: ['./turno-especialista.component.css']
})
export class TurnoEspecialistaComponent implements OnInit {

  listaTurnos:any;
  listaTurnosUsuarioActual:any;
  listaTurnosFiltrada:any;
  listaUsuarios:any;
  userState = this.authService.getUserLogged();
  userLogged:any;
  userInfo:any;
  ventanaComentario:boolean = false;
  accionElegida:string = "";
  mostrarComentarios:boolean = false;
  turnoElegido:any;
  comentarioDeEspecialista:string = "";
  errorComentario:boolean = false;
  mostrarInfoCancelacion:boolean = false;
  buscador:string="";
  constructor(public fireStoreService:FirestoreService, public authService:AuthService) {
    this.listaTurnos = [];
    this.listaTurnosUsuarioActual = [];
    this.listaUsuarios = [];
    this.listaTurnosFiltrada = [];
    this.userState.subscribe((usuario:any)=>{
      this.userLogged = usuario;
      this.fireStoreService.getCollection('Usuarios').subscribe(
        resp=>{
          this.listaUsuarios = resp;
          this.llenarDatos();
          this.fireStoreService.getCollectionWithId('Turnos','turnoId').subscribe(
            resp=>{
              this.listaTurnos = resp;
              this.turnosUsuarioActual();
          });
      });
    });
    
    
  }
  
  ngOnInit(): void {
  }

  llenarDatos(){
    if(this.userLogged != null)
    {
      for(let i=0;i < this.listaUsuarios.length;i++)
      {
        if(this.userLogged.email == this.listaUsuarios[i].email)
        {
          this.userInfo = this.listaUsuarios[i];
          break;
        }
      }
    } 
  }

  turnosUsuarioActual(){
    this.listaTurnosUsuarioActual = [];
    for(let i=0;i<this.listaTurnos.length;i++){
      if(this.userInfo.email == this.listaTurnos[i].especialista.email){
        this.listaTurnosUsuarioActual.push(this.listaTurnos[i]);
      }
    }
  }

  buscarTurno(event:any){
    this.listaTurnosFiltrada = [];
    this.buscador= event.value;
    if(this.buscador != ""){
      this.buscador  = this.buscador[0].toUpperCase() + this.buscador.slice(1);
    }
    console.log(this.buscador);
    for(let i=0;i<this.listaTurnos.length;i++){
      if(this.listaTurnos[i].especialidad.includes(this.buscador) 
      || this.listaTurnos[i].especialista.nombre.includes(this.buscador) 
      || this.listaTurnos[i].especialista.apellido.includes(this.buscador)){
          this.listaTurnosFiltrada.push(this.listaTurnos[i]);
      }
    }
  }

  abrirVentanaComentario(opcion:string,turno:any){
    if(opcion=='infoCancelacion'){
      this.mostrarInfoCancelacion = true
    }else{
      this.ventanaComentario = true;
    }
    this.accionElegida = opcion;
    this.turnoElegido = turno;
  }

  cerrarVentanaComentario(){
    this.ventanaComentario = false;
  }

  cancelarTurno(){
    if(this.comentarioDeEspecialista != ""){
      this.turnoElegido.estado = "cancelado";
      this.turnoElegido.comentarioPaciente = this.comentarioDeEspecialista;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
    }else{
      this.errorComentario = true;
    }
  }

  rechazarTurno(){
    if(this.comentarioDeEspecialista != ""){
      this.turnoElegido.estado = "rechazado";
      this.turnoElegido.comentarioPaciente = this.comentarioDeEspecialista;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
    }else{
      this.errorComentario = true;
    }
  }

  aceptarTurno(){
      this.turnoElegido.estado = "aceptado";
      this.turnoElegido.comentarioPaciente = this.comentarioDeEspecialista;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
  }

  finalizarTurno(){
    this.turnoElegido.estado = "realizado";
      this.turnoElegido.comentarioEspecialista = this.comentarioDeEspecialista;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
  }

  abrirComentarios(turno:any){
    this.turnoElegido = turno;
    this.mostrarComentarios = true;
  }
  
  cerrarComentarios(){
    this.mostrarComentarios = false;
  }

  cerrarVentanaError(){
    this.errorComentario = false;
  }

  cerrarInfoCancelacion(){
    this.mostrarInfoCancelacion = false;
  }

}
