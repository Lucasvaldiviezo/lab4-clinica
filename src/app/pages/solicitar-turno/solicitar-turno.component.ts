import { Component, OnInit } from '@angular/core';
import { AnyForUntypedForms } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent implements OnInit {
  opcionesEspecialidad:any;
  listaEspecialistas:any;
  listaUsuarios:any;
  listaPacientes:any;
  listaHorarios:any;
  listaTurnos:any;
  listaHorariosFiltrada:any;
  listaDeDias:any;
  horaDesde:number = 0;
  minutoDesde:number = 0;
  horaHasta:number = 0;
  minutoHasta:number = 0;
  mostrarDias:boolean = false;
  mostrarHorarios:boolean = false;
  especialidadSeleccionada:string = "";
  medicoSeleccionado:any;
  diaSeleccionado:string = "";
  horarioSeleccionado:string="";
  datosCompletos:boolean = false;
  userState = this.authService.getUserLogged();
  userLogged:any;
  userInfo:any;
  listaDeTurnosActuales:any;
  isAdmin:boolean = false;
  mostrarContenedorUsuarios:boolean = false;
  pacienteElegidoPorAdmin:any;
  constructor(public fireStoreService:FirestoreService,public authService:AuthService) {
    this.listaPacientes = [];
    this.listaDeDias = [];
    this.opcionesEspecialidad = [];
    this.listaEspecialistas = [];
    this.listaHorarios = [];
    this.listaHorariosFiltrada = [];

    this.fireStoreService.getCollectionWithId('Usuarios','usuarioId').subscribe(
      resp=>{
        this.listaUsuarios = resp;
        this.llenarEspecialidades();
    });
    this.fireStoreService.getCollectionWithId('Horarios','horarioId').subscribe(
      resp=>{
        this.listaHorarios = resp;
    });

    this.fireStoreService.getCollectionWithId('Turnos','turnoId').subscribe(
      resp=>{
        this.listaTurnos = resp;
    });

    this.userState.subscribe((usuario:any)=>{
      this.userLogged = usuario;
      this.fireStoreService.getCollection('Usuarios').subscribe(
        resp=>{
          this.listaUsuarios = resp;
          this.llenarDatos();
          this.cargarPacientes();
      });
    });
    this.cargarDias();
  }

  ngOnInit(): void {
  }

  cargarPacientes(){
    this.listaEspecialistas = [];
    for(let i=0; i<this.listaUsuarios.length;i++){
      if(this.listaUsuarios[i].tipoUsuario == 'paciente'){
        this.listaPacientes.push(this.listaUsuarios[i]);
      }
    }
  }

  cargarDias(){
    let fechaHoy;
    for(let i = 0; i<15;i++){
      fechaHoy = new Date();
      this.listaDeDias.push(fechaHoy.setDate(fechaHoy.getDate()+i));
    }
  }

  llenarEspecialidades(){
    for(let i=0; i<this.listaUsuarios.length;i++){
      if(this.listaUsuarios[i].tipoUsuario == "especialista"){
        for(let j=0;j<this.listaUsuarios[i].especialidades.length;j++){
          let especialidadActual = this.listaUsuarios[i].especialidades[j];
          let existeElemento:boolean = this.opcionesEspecialidad.some((especialidad:string)=>especialidad == especialidadActual);
          if(existeElemento == false){
            this.opcionesEspecialidad.push(this.listaUsuarios[i].especialidades[j]);
          }
        }
      }
    }
  }

  llenarDatos(){
    if(this.userLogged != null)
    {
      for(let i=0;i < this.listaUsuarios.length;i++)
      {
        if(this.userLogged.email == this.listaUsuarios[i].email)
        {
          this.userInfo = this.listaUsuarios[i];
          if(this.userInfo.tipoUsuario == 'admin'){
            this.isAdmin = true;
          }
          break;
        }
      }
    } 
  }

  abrirContenedorUsuarios(){
    this.mostrarContenedorUsuarios = true;
  }

  cerrarContenedorUsuarios(){
    this.mostrarContenedorUsuarios = false;
  }

  elegirEspecialidad(especialidad:any){
    this.listaEspecialistas = [];
    this.mostrarDias = false;
    this.mostrarHorarios = false;
    this.especialidadSeleccionada = especialidad;
    this.datosCompletos = false;
    for(let i=0; i<this.listaUsuarios.length;i++){
      if(this.listaUsuarios[i].tipoUsuario == "especialista"){
        for(let j=0;j<this.listaUsuarios[i].especialidades.length;j++){
          let doctorEspecialidad = this.listaUsuarios[i].especialidades[j];
          if(especialidad == doctorEspecialidad){
            this.listaEspecialistas.push(this.listaUsuarios[i]);
            break;
          }  
        }
      }
    }
  }

  elegirMedico(especialista:any){
    this.listaHorariosFiltrada = [];
    this.datosCompletos = false;
    for(let i=0;i<this.listaHorarios.length;i++){
      if(especialista.email==this.listaHorarios[i].especialista
      && this.especialidadSeleccionada == this.listaHorarios[i].especialidad)
      {
        for(let j = 0;j<this.listaHorarios[i].turnos.length;j++){
          let horario = {
            turno: this.listaHorarios[i].turnos[j],
            disponibilidad: true,
          }
          this.listaHorariosFiltrada.push(horario);
        }
        this.medicoSeleccionado = especialista;
        
      }
    }
    this.mostrarDias = true;
  }

  elegirDia(dia:Date){
    this.datosCompletos = false;
    let fecha = new Date(dia);
    this.diaSeleccionado = fecha.toDateString();
    this.mostrarHorarios = true;
    for(let i=0;i<this.listaHorariosFiltrada.length;i++){
      this.listaHorariosFiltrada[i].disponibilidad = true;
      for(let j=0;j<this.listaTurnos.length;j++){
        if(this.diaSeleccionado == this.listaTurnos[j].dia 
          && this.especialidadSeleccionada == this.listaTurnos[j].especialidad
          && this.medicoSeleccionado.email == this.listaTurnos[j].especialista.email
          && this.listaHorariosFiltrada[i].turno == this.listaTurnos[j].horario){
          this.listaHorariosFiltrada[i].disponibilidad = false;
        }
      }
    }
  }

  elegirHorario(horario:any){
    this.horarioSeleccionado = horario.turno;
    this.datosCompletos = true;
  }

  pacienteParaTurno(usuario:any){
    this.pacienteElegidoPorAdmin = usuario;
    this.mostrarContenedorUsuarios = false;
  }

  
  solicitarTurno(){
    let usuarioParaTurno:any;
    if(this.userInfo.tipoUsuario == 'admin'){
      usuarioParaTurno = this.pacienteElegidoPorAdmin;
    }else{
      usuarioParaTurno = this.userInfo;
    }
    let turnoCompleto = {
      especialidad: this.especialidadSeleccionada,
      especialista: this.medicoSeleccionado,
      dia: this.diaSeleccionado,
      horario: this.horarioSeleccionado,
      paciente: usuarioParaTurno,
      estado: "no realizado",
      comentarioPaciente: "",
      comentarioEspecialista: "",
      comentarioAdmin: "",
      calificacion: 0
    }
    this.pacienteElegidoPorAdmin = undefined;
    this.especialidadSeleccionada = "";
    this.medicoSeleccionado = undefined;
    this.diaSeleccionado = "";
    this.horarioSeleccionado = "";
    this.datosCompletos = false;
    this.mostrarDias = false;
    this.mostrarHorarios = false;
    this.listaEspecialistas = [];
    this.fireStoreService.agregarTurno("Turnos",turnoCompleto);
  }
}
