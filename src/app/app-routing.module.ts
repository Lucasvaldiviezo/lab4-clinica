import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './modules/registro/registro.component';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

const routes: Routes = [
  {path: '', redirectTo: '/bienvenido', pathMatch:'full'},
  {path:'bienvenido', component:BienvenidoComponent},
  {path:'login',component:LoginComponent},
  {path:'registro', loadChildren: () => import('./modules/registro/registro.module').then(m=>m.RegistroModule)},
  {path:'**', component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
