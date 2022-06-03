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

  archivoSubido:any;
  fotoParaMostrar:any;
  imagen:any;
  errorImagenes:boolean=false;
  mostrarFoto:boolean = false;
  imagenesListas:boolean=false;
  subiendoImagen:boolean = false;
  mostrarCampoOtros:boolean = false;
  opcionEspecialidad:string = "";
  public formRegistro: FormGroup;
  constructor(public fb: FormBuilder, public fireStore:FirestoreService, public storageService:StorageService, public authService:AuthService, public ruteo:Router) { 
    this.formRegistro = this.fb.group({
      'nombre': ['', [Validators.required, this.spacesValidator]],
      'apellido': ['', Validators.required],
      'edad': ['', [Validators.required, Validators.min(18),Validators.max(99) ]],
      'dni': ['', [Validators.required,Validators.pattern("[0-9]{8}")]],
      'especialidad': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formRegistro.controls['especialidad'].setValue("cirujano")
    this.opcionEspecialidad = "cirujano";
  }

  cargarEspecialista(){
    if(this.imagenesListas == true){
      let especialista;
      this.subiendoImagen = true;
      let nombreImagen = this.formRegistro.getRawValue().nombre+"+"+this.formRegistro.getRawValue().apellido+"+"+this.formRegistro.getRawValue().dni;
      this.storageService.subirImagenStorage(nombreImagen+"+1",this.archivoSubido[0],"especialistas/").then(urlImagen =>{
        if(urlImagen !=null)
        {
          if(this.mostrarCampoOtros == false){
            this.formRegistro.controls['especialidad'].setValue(this.opcionEspecialidad)
          }
          especialista = {
            nombre: this.formRegistro.getRawValue().nombre,
            apellido: this.formRegistro.getRawValue().apellido,
            edad: this.formRegistro.getRawValue().edad,
            dni: this.formRegistro.getRawValue().dni,
            especialidad: this.formRegistro.getRawValue().especialidad,
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
            this.formRegistro.controls['especialidad'].setValue("");
          }
          this.archivoSubido='';
          this.mostrarFoto = false;
          this.subiendoImagen = false;
        } 
      }); 
    }else
    {
      this.errorImagenes = true;
    }
  }

  onChange(opcion:any)
  {
    let auxOpcion = opcion.target.value
    if(auxOpcion=="otro"){
      this.mostrarCampoOtros = true;
      this.formRegistro.controls['especialidad'].setValue("");
    }else
    {
      this.opcionEspecialidad = opcion;
      this.mostrarCampoOtros = false;
      this.formRegistro.controls['especialidad'].setValue(this.opcionEspecialidad);
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
