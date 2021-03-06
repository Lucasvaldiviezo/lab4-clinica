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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { ColoresDirective } from './directivas/colores/colores.directive';
import { ColorTipoUsuarioDirective } from './directivas/colorTipoUsuario/color-tipo-usuario.directive';
import { BoldFontDirective } from './directivas/boldFont/bold-font.directive'; // fonts provided for pdfmake

PdfMakeWrapper.setFonts(pdfFonts);
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
    EstadisticasComponent,
    ColoresDirective,
    ColorTipoUsuarioDirective,
    BoldFontDirective,
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
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
