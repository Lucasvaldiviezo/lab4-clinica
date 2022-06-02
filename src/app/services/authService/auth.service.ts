import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../fireStoreService/firestore.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLogged:boolean = false;
  userInfo:any;
  listaUsuarios:any;
  constructor(public afauth: AngularFireAuth,public ruteo:Router, public fireStoreService:FirestoreService ) { 
    
  }

  ngOnInit(): void {
    

  }
  
  /*async register(email:string,password:string)
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
  }*/

  async register(email:string,password:string)
  {
    try{
      return await this.afauth.createUserWithEmailAndPassword(email,password).then(resp=> {
          this.sendEmailForVerification(resp);
          this.logout();
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
      return await this.afauth.signInWithEmailAndPassword(email,password).then((result)=>{
        if(result.user?.emailVerified){
          this.isUserLogged=true;
          return result.user;
        }else{
          return false;
        }
      });
    }catch(error)
    {
      return null;
    }
  }

  getUserLogged()
  {
     return this.afauth.authState;  
  }

  logout()
  {
    this.isUserLogged = false;
    this.afauth.signOut();
  }

  sendEmailForVerification(user:any)
  {
    return this.afauth.currentUser.then((u:any) => u.sendEmailVerification())
    .then(() => {
      this.ruteo.navigateByUrl('verifyEmail');
    })
      
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


