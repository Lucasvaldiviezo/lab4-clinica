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
  listaDeExcel:any = [];
  constructor(public fireStoreService:FirestoreService, public excelService:ExcelService) {
    this.fireStoreService.getCollectionWithId('Usuarios','usuarioId').subscribe(
      resp=>{
        this.listaUsuarios = resp;
        this.cargarListas();
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
  descargarExcel(){
    this.cargarListaExcel();
    this.excelService.descargarExcelUsuarios(this.listaDeExcel,'lista usuarios');
  }
}
