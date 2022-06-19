import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-turno-admin',
  templateUrl: './turno-admin.component.html',
  styleUrls: ['./turno-admin.component.css']
})
export class TurnoAdminComponent implements OnInit {

  listaTurnos:any;
  listaUsuarios:any;
  listaTurnosFiltrada:any;
  userState = this.authService.getUserLogged();
  userLogged:any;
  userInfo:any;
  mostrarCancelacion:boolean=false;
  turnoElegido:any;
  comentarioDeAdmin:string = "";
  errorComentario:boolean = false;
  buscador:string="";
  constructor(public fireStoreService:FirestoreService, public authService:AuthService) {
    this.listaTurnos = [];
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

  buscarTurno(event:any){
    this.listaTurnosFiltrada = [];
    this.buscador= event.value;
    if(this.buscador != ""){
      this.buscador  = this.buscador[0].toUpperCase() + this.buscador.slice(1);
    }
    for(let i=0;i<this.listaTurnos.length;i++){
      if(this.listaTurnos[i].especialidad.includes(this.buscador) 
      || this.listaTurnos[i].especialista.nombre.includes(this.buscador) 
      || this.listaTurnos[i].especialista.apellido.includes(this.buscador)
      || this.listaTurnos[i].paciente.apellido.includes(this.buscador)
      || this.listaTurnos[i].paciente.nombre.includes(this.buscador)
      || this.listaTurnos[i].paciente.edad.includes(this.buscador)
      || this.listaTurnos[i].especialista.edad.includes(this.buscador)
      || this.listaTurnos[i].paciente.dni.includes(this.buscador)
      || this.listaTurnos[i].especialista.dni.includes(this.buscador)
      || this.listaTurnos[i].estado.includes(this.buscador.toLocaleLowerCase())
      || this.listaTurnos[i].horario.includes(this.buscador)
      || this.listaTurnos[i].dia.includes(this.buscador)){
        console.log(this.listaTurnos[i].estado);
          this.listaTurnosFiltrada.push(this.listaTurnos[i]);
      }
    }
  }

  abrirCancelacion(turno:any){
    this.mostrarCancelacion = true;
    this.turnoElegido = turno;
  }

  cerrarCancelacion(){
    this.mostrarCancelacion = false;
  }

  cancelarTurno(){
    if(this.comentarioDeAdmin != ""){
      this.turnoElegido.estado = "cancelado";
      this.turnoElegido.comentarioAdmin = this.comentarioDeAdmin;
      this.fireStoreService.actualizarTurno("Turnos",this.turnoElegido);
      this.mostrarCancelacion = false;
    }else{
      this.errorComentario = true;
    }
  }

  cerrarVentanaError(){
    this.errorComentario = false;
  }



}
