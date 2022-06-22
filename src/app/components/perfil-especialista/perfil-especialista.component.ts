import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
import { PdfService } from 'src/app/services/pdfService/pdf.service';
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
  listaTurnos:any;
  listaTurnosDelUsuario:any;
  constructor(public authService:AuthService,public fireStoreService:FirestoreService, public storageService:StorageService, public pdfService:PdfService) { 
    this.authService.getUserLogged().subscribe(usuario=>{
      this.userLogged = usuario;
      this.fireStoreService.getCollectionWithId('Usuarios','usuarioId').subscribe(
        resp=>{
          this.listaUsuarios = resp;
          this.llenarDatos();
      });
      this.fireStoreService.getCollectionWithId('Horarios','horarioId').subscribe(
        resp=>{
          this.listaHorarios = resp;
      });
      this.fireStoreService.getCollectionWithId('Turnos','turnosId').subscribe(
        resp=>{
          this.listaTurnos = resp;
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
        this.hours.push(i.toString());
    }
    for(let i=0;i<60;i++){
      if(i<10){
        this.minutes.push("0"+i);
      }else{
        this.minutes.push(i.toString());
      }
      i = i+14;
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
    let listaTurnos:any = [];
    let turno:string = "";
    let minutosTurnos:number = +this.minutoDesde;
    let horariosDisponibles;
    let horaParaCheckear = "";
    let horarioExistente = false;
    let idHorarioActualizar;
    horaParaCheckear = this.horaHasta + ":" + this.minutoHasta;
    for(let i = +this.horaDesde; i <= +this.horaHasta;i++){
      for(let j=minutosTurnos;j<60;j++){
        if(minutosTurnos >=60){
          minutosTurnos = 0;
        }
        if(minutosTurnos == 0){
          turno =  i + ":" + "0" +minutosTurnos;
        }else{
          turno =  i + ":" + minutosTurnos;
        }
        if(turno == horaParaCheckear ){
          j = 60;
          i = +this.horaHasta + 1;
        }
        listaTurnos.push(turno);
        minutosTurnos = minutosTurnos+15;
        j=j+14;
      }
      minutosTurnos = 0;
    }
    let turnosEspecialista = {
      especialista: this.usuarioActual.email,
      especialidad: this.especialidadSeleccionada,
      turnos: listaTurnos
    }

    console.log(turnosEspecialista);
    

    for(let i = 0; i<this.listaHorarios.length;i++){
      if(turnosEspecialista.especialista == this.listaHorarios[i].especialista
        && turnosEspecialista.especialidad == this.listaHorarios[i].especialidad){
          idHorarioActualizar = this.listaHorarios[i].horarioId;
          horarioExistente = true;
          break;
      }
    }
    if(horarioExistente == false){
      this.fireStoreService.agregarHorario("Horarios",turnosEspecialista);
    }else{
      this.fireStoreService.actualizarHorario("Horarios",idHorarioActualizar,turnosEspecialista);
    } 
  }

  cargarTurnosDelUsuario(){
    this.listaTurnosDelUsuario = [];
    for(let i=0;i<this.listaTurnos.length;i++){
      if(this.usuarioActual.email == this.listaTurnos[i].especialista.email && this.listaTurnos[i].estado == 'realizado'){
        this.listaTurnosDelUsuario.push(this.listaTurnos[i]);
      }
    }
  }

  descargarMisTurnos(){
    let nombreArchivo:string = this.usuarioActual.nombre + " " + this.usuarioActual.apellido;
    this.cargarTurnosDelUsuario();
    this.pdfService.generatePDFTurnos(this.listaTurnosDelUsuario,"Clinica UTN",nombreArchivo,this.usuarioActual);
  }
}
