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
  listaUsuarios:any;
  especialistaSinAcceso:boolean=false;
  textoError:string = "";
  mostrarError:boolean = false;
  public formIngreso: FormGroup;
  captchaOkay:boolean = false;
  errorCaptcha:boolean = false;
  constructor(public ruteo:Router,public authService: AuthService, private fb: FormBuilder, public fireStore:FirestoreService) {
    this.formIngreso = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]],
    });
    this.fireStore.getCollectionWithId('Usuarios',"usuarioId").subscribe((resp:any)=>{
        this.listaUsuarios = resp;
    });
  }

  ngOnInit(): void {
  }

  aceptarPopUp(){
    this.mailSinVerificar = false;
    this.especialistaSinAcceso = false;
    this.mostrarError=false;
  }

  ingresar()
  {
    if(this.captchaOkay == true){
      const email=this.formIngreso.getRawValue().email;
      const password=this.formIngreso.getRawValue().password;
      let tipoUsuario:string = "";
        this.authService.login(email,password).then(usuario=>{   
          if(usuario!=null)
          {
            this.cambiarMailAVerificado(usuario);
            if(usuario == false){
              this.mailSinVerificar = true;
              console.log("El mail no esta verificado");
              this.authService.logout();
            }else
            {
              tipoUsuario = this.verificarTipoUsuario(usuario);
              if(tipoUsuario == "especialista"){
                if(this.verificarAcceso(usuario) == true){
                  this.ruteo.navigateByUrl('bienvenido');
                }else
                {
                  this.especialistaSinAcceso = true;
                  this.authService.logout();
                }
              }else{
                this.ruteo.navigateByUrl('bienvenido');
              }   
            } 
          }
        }).catch(error => {
          console.log(error);
        });
    }else{
      this.errorCaptcha = true;
    }
    
  }


  verificarTipoUsuario(user:any): string{
      let retorno = "admin";
      for(let i=0;i < this.listaUsuarios.length;i++)
      {
        if(user.email == this.listaUsuarios[i].email )
        {
          if(this.listaUsuarios[i].tipoUsuario == "especialista")
          {
            retorno = "especialista";
            break;
          }else if(this.listaUsuarios[i].tipoUsuario == "paciente"){
            retorno = "paciente";
            break;
          }
        }
      }
      return retorno;
  }

  verificarAcceso(user:any):boolean{
    let retorno = false;
      for(let i=0;i < this.listaUsuarios.length;i++)
      {
        if(user.email == this.listaUsuarios[i].email && this.listaUsuarios[i].tipoUsuario == "especialista")
        {
          if(this.listaUsuarios[i].acceso == true)
          {
            retorno = true;
            break;
          }
        }
      }
      return retorno;
  }

  cambiarMailAVerificado(user:any){
    let id:string;
    if(user.emailVerified == true){
      for(let i=0;i < this.listaUsuarios.length;i++)
      {
        if(user.email == this.listaUsuarios[i].email )
        {
          this.listaUsuarios[i].emailVerificado == true;
          id = this.listaUsuarios[i].usuarioId;
          this.fireStore.verificacionMail("Usuarios",id,true);
        }
      }
    }   
  }

  ShowErrors(code:string):string{
    let retorno:string = "";
    switch (code) {
            case 'auth/user-disabled': 
                retorno = 'Tu usuario ha sido desactivado.';
                break;
            case 'auth/user-not-found': 
                retorno = 'Tu usuario no existe.';
                break;
            case 'auth/wrong-password':
                retorno = "La contraseña es invalida"
                break;
            case 'auth/too-many-requests':
                retorno = "Hubo muchos intentos, su cuenta fue deshabilitada por un tiempo";
                break;
            default: 
                retorno = 'Error al logearse, intente mas tarde.';
    }       
    return retorno;   
}

verificarResultadoCaptcha(resultado:boolean){
  this.captchaOkay = resultado
}

EntrarConAdmin(){
  this.formIngreso.controls['email'].setValue("lucks.97@hotmail.com");
  this.formIngreso.controls['password'].setValue("admin1234");
  this.ingresar();
}

EntrarConPaciente1(){
  this.formIngreso.controls['email'].setValue("lucasvaldiviezo80@gmail.com");
  this.formIngreso.controls['password'].setValue("lucaspichu1");
  this.ingresar();
}
EntrarConPaciente2(){
  this.formIngreso.controls['email'].setValue("puskeqmglrsaazkhwi@nthrw.com");
  this.formIngreso.controls['password'].setValue("prueba1234");
  this.ingresar();
}
EntrarConPaciente3(){
  this.formIngreso.controls['email'].setValue("vahiy40316@nzaif.com");
  this.formIngreso.controls['password'].setValue("paciente123");
  this.ingresar();
}

EntrarConEspecialista1(){
  this.formIngreso.controls['email'].setValue("deyec31320@nzaif.com");
  this.formIngreso.controls['password'].setValue("probando12345");
  this.ingresar();
}

EntrarConEspecialista2(){
  this.formIngreso.controls['email'].setValue("lucks.977@hotmail.com");
  this.formIngreso.controls['password'].setValue("probando1414");
  this.ingresar();
}
  

}
