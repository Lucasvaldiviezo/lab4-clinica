import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';

const routes: Routes = [
  {path: '', redirectTo: '/bienvenido', pathMatch:'full'},
  {path:'bienvenido', component:BienvenidoComponent},
  {path:'login',component:LoginComponent},
  {path:'registro', loadChildren: () => import('./modules/registro/registro.module').then(m=>m.RegistroModule)},
  {path:'verifyEmail', component: VerifyEmailComponent},
  {path:'usuarios', component: UsuariosComponent},
  {path:'solicitarTurno', component: SolicitarTurnoComponent},
  {path:'misTurnos',  loadChildren: () => import('./modules/misTurnos/mis-turnos.module').then(m=>m.MisTurnosModule)},
  {path:'panelUsuario', loadChildren: () => import('./modules/panelUsuario/panel-usuario.module').then(m=>m.PanelUsuarioModule)},
  {path:'**', component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
