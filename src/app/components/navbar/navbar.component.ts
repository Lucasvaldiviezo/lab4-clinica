import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isUserLogged = this.authService.getUserLogged();
  userLogged:any = "";
  usuarioActual:any
  listaUsuarios:any;

  constructor(public authService: AuthService, public fireStoreService:FirestoreService) {
    this.usuarioActual = {
      username: "",
      fotoURL: "",
      email: "",
    }
    this.isUserLogged.subscribe(usuario=>{
      this.userLogged = usuario;
    });
    this.fireStoreService.getCollection('datosUsuarios').subscribe(
      resp=>{
        this.listaUsuarios = resp;
        this.llenarDatos();
        
    });
  }
  ngOnInit(): void {
  }

  llenarDatos()
  {
    if(this.userLogged != null)
    {
      this.authService.isUserLogged = true;
      for(let i=0;i < this.listaUsuarios.length;i++)
      {
        if(this.userLogged.email == this.listaUsuarios[i].email)
        {
          let fecha:Date = new Date(this.listaUsuarios[i].fechaCreacion);
          this.usuarioActual = this.listaUsuarios[i];
          this.usuarioActual.fechaCreacion = fecha;
          break;
        }
      }
    } 
  }

  logout()
  {
    this.authService.logout();
    this.usuarioActual = {
      username: "",
      fotoURL: "",
      email: "",
    }
  }

}
