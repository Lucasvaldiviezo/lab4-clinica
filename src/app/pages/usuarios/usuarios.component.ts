import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excelService/excel.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  listaUsuarios:any;
  listaPacientes:any = [];
  listaEspecialistas:any = [];
  listaTurnos:any = [];
  listaTurnosPaciente:any = [];
  listaDeExcel:any = [];
  nombrePacienteElegido:string ="";
  constructor(public fireStoreService:FirestoreService, public excelService:ExcelService) {
    this.fireStoreService.getCollectionWithId('Usuarios','usuarioId').subscribe(
      resp=>{
        this.listaUsuarios = resp;
        this.cargarListas();
        this.fireStoreService.getCollectionWithId('Turnos','turnoId').subscribe(
          resp=>{
            this.listaTurnos = resp;
        });
    });
   }

  ngOnInit(): void {
  }

  cargarListas(){
    this.listaPacientes = [];
    this.listaEspecialistas = [];
    for(let i=0; i<this.listaUsuarios.length;i++){
      if(this.listaUsuarios[i].tipoUsuario == 'paciente'){
        this.listaPacientes.push(this.listaUsuarios[i]);
      }else if(this.listaUsuarios[i].tipoUsuario == 'especialista'){
        this.listaEspecialistas.push(this.listaUsuarios[i]);
      }
    }
  }

  cambiarAcceso(especialista:any){
    if(especialista.acceso == false){
      this.fireStoreService.cambiarAcceso("Usuarios",especialista.usuarioId.toString(),true);
    }else{
      this.fireStoreService.cambiarAcceso("Usuarios",especialista.usuarioId.toString(),false);
    }
  }

  cargarListaExcel(){
    this.listaDeExcel=[];
    let usuario;
    for(let i=0;i<this.listaUsuarios.length;i++){
      if(this.listaUsuarios[i].tipoUsuario == 'paciente'){
        usuario ={
          nombre: this.listaUsuarios[i].nombre,
          apellido: this.listaUsuarios[i].apellido,
          email: this.listaUsuarios[i].email,
          edad: this.listaUsuarios[i].edad,
          dni: this.listaUsuarios[i].dni,
          tipoDeUsuario: this.listaUsuarios[i].tipoUsuario,
          obraSocial: this.listaUsuarios[i].obraSocial,
        }
      }else if(this.listaUsuarios[i].tipoUsuario == 'especialista'){
        usuario ={
          nombre: this.listaUsuarios[i].nombre,
          apellido: this.listaUsuarios[i].apellido,
          email: this.listaUsuarios[i].email,
          edad: this.listaUsuarios[i].edad,
          dni: this.listaUsuarios[i].dni,
          tipoDeUsuario: this.listaUsuarios[i].tipoUsuario,
          especialidades: this.listaUsuarios[i].especialidades,
        }
      }
      this.listaDeExcel.push(usuario);
    }
    console.log(this.listaDeExcel);
  }

  cargarTurnosDelPaciente(paciente:any){
    let turno;
    this.nombrePacienteElegido = paciente.nombre + " " + paciente.apellido;
    for(let i=0;i<this.listaTurnos.length;i++){
      if(paciente.dni == this.listaTurnos[i].paciente.dni){
        turno = {
          nro: i+1,
          especialista: this.listaTurnos[i].especialista.nombre + " " + this.listaTurnos[i].especialista.apellido,
          dia: this.listaTurnos[i].dia,
          hora: this.listaTurnos[i].horario,
          especialidad: this.listaTurnos[i].especialidad,
        }
        this.listaTurnosPaciente.push(turno);
      }
    }
    this.descargarExcelTurnos();
  }

  descargarExcelTurnos(){
    this.excelService.descargarExcelTurnos(this.listaTurnosPaciente,this.nombrePacienteElegido);
  }

  descargarExcel(){
    this.cargarListaExcel();
    this.excelService.descargarExcelUsuarios(this.listaDeExcel,'lista usuarios');
  }
}
