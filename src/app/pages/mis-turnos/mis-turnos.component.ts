import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {
  listaTurnos:any;
  listaTurnosUsuarioActual:any;
  listaUsuarios:any;
  userState = this.authService.getUserLogged();
  userLogged:any;
  userInfo:any;
  ventanaComentario:boolean = false;
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

  cancelarTurno(turno:any){
    this.ventanaComentario = true;
  }



}
