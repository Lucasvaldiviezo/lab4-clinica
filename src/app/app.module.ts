import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BienvenidoComponent,
    LoginComponent,
    NotfoundComponent,
    VerifyEmailComponent,
    UsuariosComponent,
    SolicitarTurnoComponent,
    CaptchaComponent,
    MisTurnosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
