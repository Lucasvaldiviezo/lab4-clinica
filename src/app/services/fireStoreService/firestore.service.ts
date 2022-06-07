import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: AngularFirestore) { }

  getCollection(coleccion:any){
    return this.firestore.collection(coleccion).valueChanges();
  }

  getCollectionWithId(coleccion:any, nombreIdField:string){
    return this.firestore.collection(coleccion).valueChanges({ idField: nombreIdField });
  }

  addUsuario(coleccion:any,usuario:any)
  {
    this.firestore.collection(coleccion).add(usuario);
  }

  cambiarAcceso(coleccion:any,id:string, nuevoValor:any)
  {
    this.firestore.collection(coleccion).doc(id).update({acceso: nuevoValor});
  }

  verificacionMail(coleccion:any,id:string, nuevoValor:any)
  {
    this.firestore.collection(coleccion).doc(id).update({emailVerificado: nuevoValor});
  }

  actualizarURL(coleccion:string,id:string,url:string)
  {
    this.firestore.collection(coleccion).doc(id).update({imagen1: url});
  }

  actualizar2URL(coleccion:string,id:string,url1:any,url2:any){
    this.firestore.collection(coleccion).doc(id).update({imagen1: url1});
    this.firestore.collection(coleccion).doc(id).update({imagen2: url2});
  }
}
