import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelUsuarioComponent } from './panel-usuario.component';

const routes: Routes = [
  {path:'', component: PanelUsuarioComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelUsuarioRoutingModule { }
