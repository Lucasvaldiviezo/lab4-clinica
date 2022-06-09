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
  hours:string[] = [];
  minutes:string[] = [];
  userLogged:any;
  usuarioActual:any
  listaUsuarios:any;
  archivoSubido:any;
  imagen:any;
  nuevaFoto:any;
  mostrarDatos:boolean = false;
  mostrarHorarios:boolean = false;
  especialidadSeleccionada:string = "";
  horaDesde:string = "00";
  horaHasta:string = "00";
  minutoDesde:string = "00";
  minutoHasta:string = "00";
  listaHorarios:any;
  constructor(public authService:AuthService,public fireStoreService:FirestoreService, public storageService:StorageService) { 
    this.authService.getUserLogged().subscribe(usuario=>{
      this.userLogged = usuario;
      this.fireStoreService.getCollectionWithId('Usuarios','usuarioId').subscribe(
        resp=>{
          this.listaUsuarios = resp;
          this.llenarDatos();
      });
    });
    this.cargarHorarios();
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
        if(this.usuarioActual.hasOwnProperty("horarios")){
          this.listaHorarios = this.usuarioActual.horarios;
        }else{
          this.listaHorarios = [];
        }
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

  abrirHorarios(especialidad:string){
    this.mostrarHorarios = true;
    this.especialidadSeleccionada = especialidad;
  }

  cargarHorarios(){
    for(let i=0;i<24;i++){
      if(i<10){
        this.hours.push("0"+i);
      }else{
        this.hours.push(i.toString());
      }
     
    }
    for(let i=0;i<60;i++){
      if(i<10){
        this.minutes.push("0"+i);
      }else{
        this.minutes.push(i.toString());
      }
    }
  }

  elegirHorarios(evento:any,horaOMinuto:string,desdeOHasta:string){
    let horario = evento.target.value;
    if(desdeOHasta == "desde"){
      if(horaOMinuto == "hora"){
        this.horaDesde = horario;
      }else{
        this.minutoDesde = horario;
      } 
    }else
    {
      if(horaOMinuto == "hora"){
        this.horaHasta = horario;
      }else{
        this.minutoHasta = horario;
      }
    }
   
  }

  guardarHorario(){
    this.mostrarHorarios = false;
    let horarioDesde = this.horaDesde + ":" + this.minutoDesde;
    let horarioHasta = this.horaHasta + ":" + this.minutoHasta;
    let horario = {
      especialidad: this.especialidadSeleccionada,
      desde: horarioDesde,
      hasta: horarioHasta
    };
    let index = -1;
    for(let i=0;i<this.listaHorarios.length;i++){
      if(horario.especialidad == this.listaHorarios[i].especialidad){
        index = i;
        break;
      }
    }
    if(index == -1){
      this.listaHorarios.push(horario);
    }else{
      this.listaHorarios[index] = horario;
    }
    this.fireStoreService.actualizarHorario("Usuarios",this.usuarioActual.usuarioId,this.listaHorarios);

    //CREAR LOS HORARIOS ACA CON 3 DATOS, DNI/MAIL DEL USUARIO, TODOS LOS HORARIOS DESDE HASTA Y SI ESTA DISPONIBLE EL TURNO.
  }
}
