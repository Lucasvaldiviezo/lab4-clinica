import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { FirestoreService } from '../fireStoreService/firestore.service';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageRef:any;
  uploadTask:any;
  imagesItems:any;
  constructor(public storage:Storage,public firestore:FirestoreService) { 
    this.obtenerImagenes("peliculas");
  }

  async subirImagenStorage(nombre:string,imgBase64:any,carpeta:string){
    try{
      this.storageRef = ref(this.storage,carpeta+nombre);
      let respuesta = await uploadBytes(this.storageRef,imgBase64)
        return await getDownloadURL(respuesta.ref)
    }catch(error){
      console.log(error);
      return null;
    }
  }

  obtenerImagenes(carpeta:string){
    this.storageRef = ref(this.storage, carpeta);
    listAll(this.storageRef)
    .then(async response=>{
      this.imagesItems = response.items;
    })
    .catch(error=>console.log(error));
  }

  obtenerURLImagen(carpeta:string,nombreImagen:string,idImagen:string,coleccion:string){
    let imagenBuscada = carpeta + "/" + idImagen +"+"+ nombreImagen;
    this.storageRef = ref(this.storage, carpeta);
    listAll(this.storageRef)
    .then(response=>{
      for(let item of response.items){
        if(imagenBuscada == item.fullPath)
        {
          getDownloadURL(item)
          .then(response=>{
            this.firestore.actualizarURL(idImagen,response,coleccion);
          })
          .catch(error=> console.log(error)); 
        }   
      }
    })
    .catch(error=>console.log(error));
  }
}
