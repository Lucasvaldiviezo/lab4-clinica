import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
import { StorageService } from 'src/app/services/storageService/storage.service';
@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {
  archivoSubido:any;
  fotoParaMostrar1:any;
  fotoParaMostrar2:any;
  imagen:any;
  errorImagenes:boolean=false;
  mostrarFoto1:boolean = false;
  mostrarFoto2:boolean = false;
  imagenesListas:boolean=false;
  subiendoImagen:boolean = false;
  public formRegistro: FormGroup;
  constructor(public fb: FormBuilder, public fireStore:FirestoreService, public storageService:StorageService, public authService:AuthService, public ruteo:Router) { 
    this.formRegistro = this.fb.group({
      'nombre': ['', [Validators.required, this.spacesValidator]],
      'apellido': ['', Validators.required],
      'edad': ['', [Validators.required, Validators.min(18),Validators.max(99) ]],
      'dni': ['', [Validators.required,Validators.pattern("[0-9]{8}")]],
      'obraSocial': ['', [Validators.required,Validators.min(3)]],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  cargarPaciente(){
    if(this.imagenesListas == true){
      let paciente;
      this.subiendoImagen = true;
      let nombreImagen = this.formRegistro.getRawValue().nombre+"+"+this.formRegistro.getRawValue().apellido+"+"+this.formRegistro.getRawValue().dni;
      this.storageService.subirImagenStorage(nombreImagen+"+1",this.archivoSubido[0],"pacientes/").then(urlImagen1 =>{
        this.storageService.subirImagenStorage(nombreImagen+"+2",this.archivoSubido[1],"pacientes/").then(urlImagen2 =>{
          if(urlImagen1 !=null && urlImagen2 != null)
          {
            paciente = {
              nombre: this.formRegistro.getRawValue().nombre,
              apellido: this.formRegistro.getRawValue().apellido,
              edad: this.formRegistro.getRawValue().edad,
              dni: this.formRegistro.getRawValue().dni,
              obraSocial: this.formRegistro.getRawValue().obraSocial,
              email: this.formRegistro.getRawValue().email,
              imagen1: urlImagen1,
              imagen2: urlImagen2
            }
            this.fireStore.addPaciente("Pacientes",paciente);
            this.registrarse(this.formRegistro.getRawValue().email,this.formRegistro.getRawValue().password);
            if(this.formRegistro.valid){
              this.formRegistro.controls['nombre'].setValue("");
              this.formRegistro.controls['apellido'].setValue("");
              this.formRegistro.controls['edad'].setValue("");
              this.formRegistro.controls['dni'].setValue("");
              this.formRegistro.controls['email'].setValue("");
              this.formRegistro.controls['password'].setValue("");
              this.formRegistro.controls['obraSocial'].setValue("");
            }
            this.archivoSubido='';
            this.mostrarFoto1 = false;
            this.mostrarFoto2 = false;
            this.subiendoImagen = false;
          } 
        });
      });  
    }else
    {
      this.errorImagenes = true;
    }
  }

  registrarse(email:string,password:string)
  {

    this.authService.register(email,password)
    .then((res:any) =>{
      console.log("se registro!: ",res);
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
        this.fotoParaMostrar1 = this.imagen;
        this.mostrarFoto1 = true;
        this.mostrarFoto2 = false;
      }
    }
    if(this.archivoSubido.length>=2){
      let reader2 = new FileReader();
      reader2.readAsDataURL(this.archivoSubido[1]);
      reader2.onloadend = () => {
        this.imagen = reader2.result;
        this.fotoParaMostrar2 = this.imagen;
        this.mostrarFoto2 = true;
        this.imagenesListas = true;
        this.errorImagenes = false;
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
