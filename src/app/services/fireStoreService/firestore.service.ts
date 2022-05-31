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

  addPaciente(coleccion:any,paciente:any)
  {
    this.firestore.collection(coleccion).add(paciente);
  }

  actualizarURL(coleccion:string,id:string,url:string)
  {
    this.firestore.collection(coleccion).doc(id).update({urlImagen: url});
  }
}
