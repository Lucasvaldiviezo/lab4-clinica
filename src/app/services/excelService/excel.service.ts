import { Injectable } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  options:any;

  constructor() { 
    
  }

  descargarExcelUsuarios(datos:any,nombreArchivo:string){
    this.options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Lista de Usuarios',
      useBom: true,
      noDownload: false,
      headers: ["Nombre", "Apellido", "Email","Edad", "DNI", "Tipo de Usuario","Obra Social/Especialidades"]
    };
    new ngxCsv(datos, nombreArchivo,this.options);
  }
  
}
