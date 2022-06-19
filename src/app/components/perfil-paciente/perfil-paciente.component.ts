import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
import { StorageService } from 'src/app/services/storageService/storage.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent implements OnInit {

  userLogged:any;
  usuarioActual:any
  listaUsuarios:any;
  archivoSubido:any;
  imagen:any;
  nuevaFoto1:any;
  nuevaFoto2:any;
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
    if(this.archivoSubido.length>=1){
      let reader = new FileReader();
      reader.readAsDataURL(this.archivoSubido[0]);
      reader.onloadend = () => {
        this.imagen = reader.result;
        this.nuevaFoto1 = this.imagen;
      }
    }
    if(this.archivoSubido.length>=2){
      let reader2 = new FileReader();
      reader2.readAsDataURL(this.archivoSubido[1]);
      reader2.onloadend = () => {
        this.imagen = reader2.result;
        this.nuevaFoto2 = this.imagen;
      }
    }  
  }

  cambiarFotoPerfil(nombreImagen1:string,nombreImagen2:string){
    let nuevaFoto1:any;
    let nuevaFoto2:any;
    this.storageService.subirImagenStorage(nombreImagen1,this.archivoSubido[0],"pacientes/").then(urlImagen1 =>{
      nuevaFoto1 = urlImagen1;
      if(nuevaFoto1 != null)
      {
        this.storageService.subirImagenStorage(nombreImagen2,this.archivoSubido[1],"pacientes/").then(urlImagen2 =>{
          nuevaFoto2 = urlImagen2;
          if(nuevaFoto2 != null){
            this.fireStoreService.actualizar2URL("Usuarios",this.usuarioActual.usuarioId,nuevaFoto1,nuevaFoto2);
          }  
        });
      }
    });
  }

  guardarDatos(){
    if(this.nuevaFoto1 != this.usuarioActual.imagen1 && this.nuevaFoto2 != this.usuarioActual.imagen2)
    { 
      let nombreImagen1:string = this.usuarioActual.nombre+"+"+this.usuarioActual.apellido+"+"+this.usuarioActual.dni+"+"+"1";
      let nombreImagen2:string = this.usuarioActual.nombre+"+"+this.usuarioActual.apellido+"+"+this.usuarioActual.dni+"+"+"2";
      this.cambiarFotoPerfil(nombreImagen1,nombreImagen2);
    }
  }

}
