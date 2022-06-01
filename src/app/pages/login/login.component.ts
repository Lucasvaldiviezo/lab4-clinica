import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  imagen:any;
  archivoSubido:any;
  mostrarImagen:boolean = false;
  mailSinVerificar:boolean = false;
  public formRegistro: FormGroup;
  constructor(public ruteo:Router,public authService: AuthService, private fb: FormBuilder, public fireStore:FirestoreService) {
    this.formRegistro = this.fb.group({
      'username': ['', [Validators.required, this.spacesValidator]],
      'password': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'fechaNacimiento': ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
  }

  usuario={
    email:'lucasvaldiviezo80@gmail.com',
    password: 'lucaspichu1'
  }

  ingresar()
  {
    const{email,password}=this.usuario;

    this.authService.login(email,password)
    .then( res =>{
        if(res==null)
        {
          console.log("error al logearse",res);
        }else
        {
          if(res.emailVerified != true){
            this.mailSinVerificar = true;
          }else
          {
            console.log("ingreso!: ",res);
            this.ruteo.navigateByUrl('bienvenido');
          } 
        } 
      })
    .catch((error:any) =>
      {
          console.log("error al logearse",error);
      });
  }

  private spacesValidator(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null; 
  }

}
