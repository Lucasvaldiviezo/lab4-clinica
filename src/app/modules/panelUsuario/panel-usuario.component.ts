import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-panel-usuario',
  templateUrl: './panel-usuario.component.html',
  styleUrls: ['./panel-usuario.component.css']
})
export class PanelUsuarioComponent implements OnInit {
  userLogged:any;
  listaUsuarios:any;
  isPaciente:boolean=false;
  isEspecialista:boolean=false;
  constructor(public authService:AuthService,public fireStoreService:FirestoreService) { 
    this.authService.getUserLogged().subscribe(usuario=>{
      this.userLogged = usuario;
      this.fireStoreService.getCollection('Usuarios').subscribe(
        resp=>{
          this.listaUsuarios = resp;
          this.saberTipoUsuario();
      });
    });
  }

  ngOnInit(): void {
  }

  saberTipoUsuario(){
    for(let i=0;i < this.listaUsuarios.length;i++)
    {
      if(this.userLogged.email == this.listaUsuarios[i].email)
      {
        if(this.listaUsuarios[i].tipoUsuario == "paciente"){
          this.isPaciente = true;
          this.isEspecialista = false;
        }else if(this.listaUsuarios[i].tipoUsuario == "especialista")
        {
          this.isPaciente = false;
          this.isEspecialista = true;
        }
        break;
      }
    }
  }

}
