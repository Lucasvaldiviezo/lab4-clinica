import { Component, OnInit } from '@angular/core';
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
  constructor(public fireStoreService:FirestoreService) {
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
}
