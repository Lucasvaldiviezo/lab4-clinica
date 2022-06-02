import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userState = this.authService.getUserLogged();
  userLogged:any;
  userInfo:any;
  listaUsuarios:any;
  constructor(public authService: AuthService, public fireStoreService:FirestoreService, public ruteo:Router) {
    this.userInfo = {
      username: "",
      email: "",
    }
    
    this.userState.subscribe((usuario:any)=>{
      this.userLogged = usuario;
    });
    
    this.fireStoreService.getCollection('Usuarios').subscribe(
      resp=>{
        this.listaUsuarios = resp;
        this.llenarDatos();
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

  logout()
  {
    this.authService.logout();
    this.userLogged = null;
    this.ruteo.navigateByUrl('bienvenido');
  }

}
