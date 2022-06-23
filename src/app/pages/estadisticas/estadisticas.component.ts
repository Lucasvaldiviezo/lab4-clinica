import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/fireStoreService/firestore.service';
import { Chart, registerables } from 'node_modules/chart.js'
import { PdfService } from 'src/app/services/pdfService/pdf.service';
import { ExcelService } from 'src/app/services/excelService/excel.service';
Chart.register(...registerables);
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  listaTurnos:any;
  listaLogeos:any;
  listaEspecialidades:any;
  listaLogeosExcel:any;
  mostrarEspecialidades:boolean = false;
  mostrarDias:boolean = false;
  mostrarLogeos:boolean = false;
  mostrarTurnos:boolean = false;
  totalTurnosFinalizados:number = 0;
  totalTurnosSolicitados:number = 0;
  turnosPorDia:number = 0;
  myChart:any;
  constructor(public fireStoreService:FirestoreService, public pdfService:PdfService, public excelService:ExcelService) { 
    this.listaTurnos = [];
    this.listaEspecialidades = [];
    this.listaLogeos = [];
    this.fireStoreService.getCollectionWithId('Turnos','turnoId').subscribe(
      resp=>{
        this.listaTurnos = resp;
        this.contarTurnosPorEspecialidad();
        this.contarTurnosPorSemana();
        this.graficoTurnos();
        this.contarTurnosPorDia();
    });
    this.fireStoreService.getCollectionWithId('LogIngresos','logeoId').subscribe(
      resp=>{
        this.listaLogeos = resp;
    });
  }

  ngOnInit(): void {
    
  }


  contarTurnosPorEspecialidad(){
    this.listaEspecialidades = [];
    let isFound = false;
    let indiceUsuario = 0;
    let especialidadActual:any;
    for(let i=0;i<this.listaTurnos.length;i++){
      especialidadActual = {
        nombre: '',
        cantidadTurnos: 0,
      }
      especialidadActual.nombre = this.listaTurnos[i].especialidad;
      for(let j=0;j<this.listaEspecialidades.length;j++){
        if(especialidadActual.nombre == this.listaEspecialidades[j].nombre){
          indiceUsuario = j;
          isFound = true;
          break;
        }
      }
      if(isFound){
        isFound = false;
        this.listaEspecialidades[indiceUsuario].cantidadTurnos++;
      }else{
        especialidadActual.nombre = this.listaTurnos[i].especialidad;
        especialidadActual.cantidadTurnos = 1; 
        this.listaEspecialidades.push(especialidadActual);
      }
    }
  }

  contarTurnosPorSemana(){
    let currentDate = new Date;
    let first  = currentDate.getDate() - currentDate.getDay(); 
    let last = first + 6;
    let firstDate= new Date(currentDate.setDate(first));
    let lastDate = new Date(currentDate.setDate(last));;
    for(let i=0;i<this.listaTurnos.length;i++){
      let date = new Date(this.listaTurnos[i].dia);

      if(date.getDate() > firstDate.getDate() && date.getDate()<lastDate.getDate()){
        if(this.listaTurnos[i].estado =='realizado'){
          this.totalTurnosFinalizados++;
          this.totalTurnosSolicitados++;
        }else{
          this.totalTurnosSolicitados++;
        }
        
      }
    }
  }

  contarTurnosPorDia(){
    let currentDate = new Date();
    let firstDate = new Date();
    let contadorTurnos=0;
    let cantidadDias = 0;
    for(let i=0;i<this.listaTurnos.length;i++){
      let date = new Date(this.listaTurnos[i].dia);
      if(date < firstDate){
        firstDate = date;
      }
      contadorTurnos++;
    }
    cantidadDias = currentDate.getDate() - firstDate.getDate();
    this.turnosPorDia = (contadorTurnos/cantidadDias);
  }

  graficoTurnos(){
    //const canvas =  <HTMLCanvasElement> document.getElementById('turnosChart');
    //const ctx = canvas?.getContext('2d');
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart("turnosChart", {
      type: 'bar',
      data: {
          labels: ['Turnos Finalizados', 'Turnos Solicitados'],
          datasets: [{
              label: '# de Turnos esta Semana',
              data: [this.totalTurnosFinalizados,this.totalTurnosSolicitados],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }

  mostrarVentanaDatos(opcion:string){
    switch(opcion){
      case 'especialidades':
        this.mostrarEspecialidades = true;
        this.mostrarLogeos = false;
        this.mostrarTurnos = false;
        break;
      case 'turnos':
        this.mostrarLogeos = false;
        this.mostrarEspecialidades = false;
        this.mostrarTurnos= true;
        break;
      case 'logeos':
        this.mostrarLogeos = true;
        this.mostrarEspecialidades = false;

        this.mostrarTurnos = false;
        break;
  
    }
  }

  descargarPDFEstadisticas(){
    let datos = { 
      cantTurnosEspecialidades: this.listaEspecialidades,
      cantTurnosFinalizados: this.totalTurnosFinalizados,
      cantTurnosSolicitados: this.totalTurnosSolicitados,
      cantTurnosPorDia: this.turnosPorDia,
      logeos: this.listaLogeos
    }
    this.pdfService.generatePDFEstadisticas(datos,'Estadisticas','estadisticas');
  }

  descargarExcelLogeos(){
    this.listaLogeosExcel = [];
    let datos;
    for(let i=0;i<this.listaLogeos.length;i++){
      datos = {
        usuario: this.listaLogeos[i].usuario,
        email: this.listaLogeos[i].email,
        dia: this.listaLogeos[i].fecha,
        hora: this.listaLogeos[i].horario,
        tipoUsuario: this.listaLogeos[i].tipoUsuario
      }
      this.listaLogeosExcel.push(datos);
    }
    this.excelService.descargarExcelLogeos(this.listaLogeosExcel,'lista usuarios');
  }

}
