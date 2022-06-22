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
  listaUsuariosAtendidos:any;
  userState = this.authService.getUserLogged();
  userLogged:any;
  userInfo:any;
  ventanaComentario:boolean = false;
  accionElegida:string = "";
  mostrarComentarios:boolean = false;
  turnoElegido:any;
  comentario:string = "";
  errorComentario:boolean = false;
  mostrarInfoCancelacion:boolean = false;
  buscador:string="";
  mostrarFormHistoriaClinica:boolean = false;
  mostrarListaUsuarios:boolean = false;
  constructor(public fireStoreService:FirestoreService, public authService:AuthService) {
    this.listaTurnos = [];
    this.listaTurnosUsuarioActual = [];
    this.listaUsuarios = [];
    this.listaTurnosFiltrada = [];
    this.listaUsuariosAtendidos = [];
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
    this.llenarUsuarioAtendidos();
  }

  llenarUsuarioAtendidos(){
    let pacienteActual;
    let isFound = false;
    this.listaUsuariosAtendidos = [];
    let indiceUsuario = 0;
    for(let i=0;i<this.listaTurnosUsuarioActual.length;i++){
      pacienteActual = this.listaTurnosUsuarioActual[i].paciente;
      if(this.listaUsuariosAtendidos.length > 0){
        for(let j=0;j<this.listaUsuariosAtendidos.length;j++){
          if(pacienteActual.dni == this.listaUsuariosAtendidos[j].dni){
            indiceUsuario = j;
            isFound = true;
            break;
          }
        }
      }
      if(isFound){
        isFound = false;
        this.listaUsuariosAtendidos[indiceUsuario].vecesAtendido++;
      }else{
        pacienteActual.vecesAtendido = 1;
        this.listaUsuariosAtendidos.push(pacienteActual);
      }
    }
  }

  turnoPacienteElegido(paciente:any){
    this.buscador = paciente.dni;
    this.buscador  = this.buscador[0].toUpperCase() + this.buscador.slice(1);
    this.cargarListaFiltrada(this.buscador);
    this.mostrarListaUsuarios = false;
  }

  buscarTurno(event:any){
    this.buscador= event.value;
    if(this.buscador != ""){
      this.buscador  = this.buscador[0].toUpperCase() + this.buscador.slice(1);
    }
    this.cargarListaFiltrada(this.buscador);
  }

  cargarListaFiltrada(datoBuscador:string){
    this.listaTurnosFiltrada = [];
    for(let i=0;i<this.listaTurnos.length;i++){
      if(this.listaTurnos[i].paciente.apellido.includes(datoBuscador)
      || this.listaTurnos[i].paciente.nombre.includes(datoBuscador)
      || this.listaTurnos[i].paciente.edad.includes(datoBuscador)
      || this.listaTurnos[i].paciente.dni.includes(datoBuscador)
      || this.listaTurnos[i].estado.includes(datoBuscador.toLocaleLowerCase())
      || this.listaTurnos[i].horario.includes(datoBuscador)
      || this.listaTurnos[i].dia.includes(datoBuscador)){
          this.listaTurnosFiltrada.push(this.listaTurnos[i]);
      }
    }
  }

  abrirVentanaComentario(opcion:string,turno:any){
    this.accionElegida = opcion;
    this.turnoElegido = turno;
    if(opcion=='infoCancelacion'){
      this.mostrarInfoCancelacion = true
    }else if(opcion =='finalizar'){
      this.mostrarFormHistoriaClinica = true;
    }
    else{
      this.ventanaComentario = true;
    }
  }

  cerrarVentanaComentario(){
    this.ventanaComentario = false;
  }

  cancelarTurno(){
    if(this.comentario != ""){
      this.turnoElegido.estado = "cancelado";
      this.turnoElegido.comentarioEspecialista = this.comentario;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
    }else{
      this.errorComentario = true;
    }
  }

  rechazarTurno(){
    if(this.comentario != ""){
      this.turnoElegido.estado = "rechazado";
      this.turnoElegido.comentarioEspecialista = this.comentario;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
    }else{
      this.errorComentario = true;
    }
  }

  aceptarTurno(){
      this.turnoElegido.estado = "aceptado";
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.ventanaComentario = false;
  }

  finalizarTurno(){
    this.turnoElegido.estado = "realizado";
    this.turnoElegido.comentarioEspecialista = this.comentario;
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

  cerrarVentanaHistoriaClinica(valor:any){
    if(valor==false){
      this.mostrarFormHistoriaClinica = false;
      this.ventanaComentario = true;
    }
  }

  cambiarLista(){
    if(this.mostrarListaUsuarios == false){
      this.mostrarListaUsuarios = true;
    }else
    {
      this.mostrarListaUsuarios = false
    }
  }

}
