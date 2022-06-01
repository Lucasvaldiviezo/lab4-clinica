import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';

const routes: Routes = [
  {path: '', redirectTo: '/bienvenido', pathMatch:'full'},
  {path:'bienvenido', component:BienvenidoComponent},
  {path:'login',component:LoginComponent},
  {path:'registro', loadChildren: () => import('./modules/registro/registro.module').then(m=>m.RegistroModule)},
  {path:'verifyEmail', component: VerifyEmailComponent},
  {path:'**', component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
