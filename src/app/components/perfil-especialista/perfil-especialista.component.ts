import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
import { StorageService } from 'src/app/services/storageService/storage.service';

@Component({
  selector: 'app-perfil-especialista',
  templateUrl: './perfil-especialista.component.html',
  styleUrls: ['./perfil-especialista.component.css']
})
export class PerfilEspecialistaComponent implements OnInit {

  userLogged:any;
  usuarioActual:any
  listaUsuarios:any;
  archivoSubido:any;
  imagen:any;
  nuevaFoto:any;
  mostrarDatos:boolean = false;
  constructor(public authService:AuthService,public fireStoreService:FirestoreService, public storageService:StorageService) { 
    this.authService.getUserLogged().subscribe(usuario=>{
      this.userLogged = usuario;
      this.fireStoreService.getCollectionWithId('Usuarios','usuarioId').subscribe(
        resp=>{
          this.listaUsuarios = resp;
          this.llenarDatos();
      });
    });
  }

  ngOnInit(): void {
    
  }
  llenarDatos()
  {
    for(let i=0;i < this.listaUsuarios.length;i++)
    {
      if(this.userLogged.email == this.listaUsuarios[i].email)
      {
        this.usuarioActual = this.listaUsuarios[i];
        this.mostrarDatos = true;
        break;
      }
    }
  }

  obtenerImagen(imagen:any)
  {
    this.archivoSubido = imagen.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(this.archivoSubido[0]);
    reader.onloadend = () => {
      this.imagen = reader.result;
      this.nuevaFoto = this.imagen;
    }
  }

  cambiarFotoPerfil(nombreImagen:string){
    let foto:any;
    this.storageService.subirImagenStorage(nombreImagen,this.archivoSubido[0],"especialistas/").then(urlImagen1 =>{
      foto = urlImagen1;
      if(foto != null)
      {
        this.fireStoreService.actualizarURL("Usuarios",this.usuarioActual.usuarioId,foto);
      }
    });
  }

  guardarDatos(){
    if(this.nuevaFoto != this.usuarioActual.imagen1)
    { 
      let nombreImagen:string = this.usuarioActual.nombre+"+"+this.usuarioActual.apellido+"+"+this.usuarioActual.dni+"+"+"1";
      this.cambiarFotoPerfil(nombreImagen);
    }
  }
}
