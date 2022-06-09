import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
import { StorageService } from 'src/app/services/storageService/storage.service';
@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css']
})
export class RegistroEspecialistaComponent implements OnInit {
  opcionesSelect:string[];
  archivoSubido:any;
  fotoParaMostrar:any;
  imagen:any;
  errorImagenes:boolean=false;
  errorEspecialidades:boolean = false;
  mostrarFoto:boolean = false;
  imagenesListas:boolean=false;
  subiendoImagen:boolean = false;
  mostrarCampoOtros:boolean = false;
  opcionSeleccionada:string = "";
  especialidadesAgregadas:any = [];
  public formRegistro: FormGroup;
  constructor(public fb: FormBuilder, public fireStore:FirestoreService, public storageService:StorageService, public authService:AuthService, public ruteo:Router) { 
    this.opcionesSelect = ["Cirujano","Pediatra","Cardiologo","Oncologo","Ginecologo","Otro"];
    this.formRegistro = this.fb.group({
      'nombre': ['', [Validators.required, this.spacesValidator]],
      'apellido': ['', Validators.required],
      'edad': ['', [Validators.required, Validators.min(18),Validators.max(99) ]],
      'dni': ['', [Validators.required,Validators.pattern("[0-9]{8}")]],
      'especialidades': (['', Validators.required]),
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  cargarEspecialista(){
    if(this.imagenesListas == true){
      if(this.especialidadesAgregadas.length > 0){
        let especialista;
        this.subiendoImagen = true;
        let nombreImagen = this.formRegistro.getRawValue().nombre+"+"+this.formRegistro.getRawValue().apellido+"+"+this.formRegistro.getRawValue().dni;
        this.storageService.subirImagenStorage(nombreImagen+"+1",this.archivoSubido[0],"especialistas/").then(urlImagen =>{
          if(urlImagen !=null)
          {
            this.formRegistro.controls['especialidades'].setValue(this.especialidadesAgregadas);
            especialista = {
              nombre: this.formRegistro.getRawValue().nombre,
              apellido: this.formRegistro.getRawValue().apellido,
              edad: this.formRegistro.getRawValue().edad,
              dni: this.formRegistro.getRawValue().dni,
              especialidades: this.formRegistro.getRawValue().especialidades,
              email: this.formRegistro.getRawValue().email,
              imagen1: urlImagen,
              emailVerificado: false,
              acceso: false,
              tipoUsuario: "especialista"
            }
            this.fireStore.addUsuario("Usuarios",especialista);
            this.registrarse(this.formRegistro.getRawValue().email,this.formRegistro.getRawValue().password);
            if(this.formRegistro.valid){
              this.formRegistro.controls['nombre'].setValue("");
              this.formRegistro.controls['apellido'].setValue("");
              this.formRegistro.controls['edad'].setValue("");
              this.formRegistro.controls['dni'].setValue("");
              this.formRegistro.controls['email'].setValue("");
              this.formRegistro.controls['password'].setValue("");
              this.formRegistro.controls['especialidades'].setValue("");
            }
            this.archivoSubido='';
            this.mostrarFoto = false;
            this.subiendoImagen = false;
          } 
        }); 
      }else{
        this.errorEspecialidades = true;
      } 
    }else
    {
      this.errorImagenes = true;
    }

  }

  elegirOpcionParaAgregar(opcion:string)
  {
    let auxOpcion = opcion;
    if(auxOpcion=="Otro"){
      this.mostrarCampoOtros = true;
    }else
    {
      this.opcionSeleccionada = opcion;
      this.mostrarCampoOtros = false;
    }
  }

  elegirOpcionParaQuitar(opcion:string)
  {
    console.log(opcion);
    this.opcionSeleccionada = opcion;
  }

  agregarEspecialidad(){
    if(this.mostrarCampoOtros == true){
      this.opcionSeleccionada = (<HTMLInputElement>document.getElementById("especialidad")).value;
      if(this.opcionSeleccionada != ""){
        this.especialidadesAgregadas.push(this.opcionSeleccionada);
      }
    }else{
      let existeElemento:boolean = this.especialidadesAgregadas.some((especialidad:string)=>especialidad == this.opcionSeleccionada);
      if(existeElemento == false){
        if(this.opcionSeleccionada != ""){
          this.especialidadesAgregadas.push(this.opcionSeleccionada);
        }
      }
    }
  }

  quitarEspecialidad(){
    let existeElemento:boolean = this.especialidadesAgregadas.some((especialidad:string)=>especialidad == this.opcionSeleccionada);
    if(existeElemento == true){
      let index: number = this.especialidadesAgregadas.indexOf(this.opcionSeleccionada);
      this.especialidadesAgregadas.splice(index, 1);
    }
  }


  registrarse(email:string,password:string)
  {
    this.authService.register(email,password)
    .then((res:any) =>{
      this.ruteo.navigateByUrl('bienvenido');
    })
    .catch((error:any) =>
    {
        console.log("error al registrarse",error);
    });
  }

  obtenerImagen(imagen:any)
  {
    this.archivoSubido = imagen.target.files;
    if(this.archivoSubido.length>=1){
      let reader = new FileReader();
      reader.readAsDataURL(this.archivoSubido[0]);
      reader.onloadend = () => {
        this.imagen = reader.result;
        this.fotoParaMostrar = this.imagen;
        this.mostrarFoto = true;
        this.imagenesListas = true;
      }
    } 
  }

  private spacesValidator(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null; 
  }

}
