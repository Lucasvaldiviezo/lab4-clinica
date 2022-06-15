import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
;
@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent implements OnInit {

  listaTurnos:any;
  listaTurnosUsuarioActual:any;
  listaUsuarios:any;
  userState = this.authService.getUserLogged();
  userLogged:any;
  userInfo:any;
  ventanaComentario:boolean = false;
  accionElegida:string = "";
  mostrarComentarioEspecialista:boolean=false;
  turnoElegido:any;
  comentarioDePaciente:string = "";
  errorComentario:boolean = false;
  calificacionPaciente:number = 0;
  constructor(public fireStoreService:FirestoreService, public authService:AuthService) {
    this.listaTurnos = [];
    this.listaTurnosUsuarioActual = [];
    this.listaUsuarios = [];
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
      if(this.userInfo.email == this.listaTurnos[i].paciente.email){
        this.listaTurnosUsuarioActual.push(this.listaTurnos[i]);
      }
    }
  }

  abrirVentanaComentario(opcion:string,turno:any){
    this.ventanaComentario = true;
    this.accionElegida = opcion;
    this.turnoElegido = turno;
  }

  cerrarVentanaComentario(){
    this.ventanaComentario = false;
  }

  cancelarTurno(){
    if(this.comentarioDePaciente != ""){
      this.turnoElegido.estado = "cancelado";
      this.turnoElegido.comentarioPaciente = this.comentarioDePaciente;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
    }else{
      this.errorComentario = true;
    }
  }

  obtenerValoracion(event:any){
    console.log(event.value);
    this.calificacionPaciente = +event.value;
  }

  calificarTurno(){
    if(this.comentarioDePaciente != "" && this.calificacionPaciente != 0){
      this.turnoElegido.calificacion = this.calificacionPaciente;
      this.turnoElegido.comentarioPaciente = this.comentarioDePaciente;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
    }else{
      this.errorComentario = true;
    }
  }


  verComentarioEspecialista(turno:any){
    this.mostrarComentarioEspecialista = true;
    this.turnoElegido = turno;
  }

  cerrarComentarioEspecialista(){
    this.mostrarComentarioEspecialista = false;
  }

  cerrarVentanaError(){
    this.errorComentario = false;
  }

}
