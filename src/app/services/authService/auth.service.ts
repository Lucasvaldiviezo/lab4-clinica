import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isUserLogged:boolean = false;
  constructor(public afauth: AngularFireAuth,public ruteo:Router ) { }

  async register(email:string,password:string)
  {
    try{
      return await this.afauth.createUserWithEmailAndPassword(email,password).then(resp=> {
          this.sendEmailForVerification(resp);
      });
    }catch(error)
    {
      console.log("error en registro", error);
      return null;
    }
  }

  async login(email:string,password:string)
  {
    try{
      this.isUserLogged=true;
      return await this.afauth.signInWithEmailAndPassword(email,password);
    }catch (error)
    {
      console.log("error en login", error);
      return null;
    }
  }

  getUserLogged()
  {
    return this.afauth.authState;
  }

  logout()
  {
    this.ruteo.navigateByUrl('bienvenido');
    this.isUserLogged = false;
    this.afauth.signOut();
  }

  sendEmailForVerification(user:any)
  {
    user.sendEmailVerification();
  }

   /*async loginWithGoogle(email:string,password:string)
  {
    try{
      return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }catch (error)
    {
      console.log("error en login con google", error);
      return null;
    }
  }*/
}
