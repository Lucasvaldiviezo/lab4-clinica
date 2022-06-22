import { Injectable } from '@angular/core';
import { PdfMakeWrapper, Txt, Img, IImg, Stack  } from 'pdfmake-wrapper';
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() { }

  async generatePDFHistoriasClinicas(datos:any,titulo:string,nombreArchivo:string){
    let pdf = new PdfMakeWrapper();
    let fechaActual = new Date();
    pdf.add( 
      await new Img('assets/favicon_io/android-chrome-512x512.png').fit([100, 100]).alignment('center').build()
    );
    pdf.add(
      new Txt(titulo).alignment('center').margin(40).fontSize(50).bold().end, 
    );

    pdf.add(
      new Txt('Paciente: ' +nombreArchivo).alignment('right').fontSize(12).bold().italics().color('gray').end, 
    )

    pdf.add(
      new Txt('Fecha de Hoy: ' + fechaActual.toDateString()).alignment('right').fontSize(12).bold().italics().color('gray').end, 
    )
    
    for(let i=0;i<datos.length;i++){

      pdf.add(
        new Txt('Historia Clinica NRO ' + i+1).alignment('center').color('red').margin(30).fontSize(20).end 
      );
      


      pdf.add(
        new Txt('Especialidad: ' + datos[i].especialidad).alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt('Horario: ' + datos[i].horario).alignment('left').margin(5).fontSize(12).end
      );
  
      pdf.add(
        new Txt('Dia: ' + datos[i].dia).alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt('Peso: ' + datos[i].peso).alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt('Altura: ' + datos[i].altura).alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt('Temperatura: ' + datos[i].temperatura).alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt('Presión: ' + datos[i].presion).alignment('left').margin(5).margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt('Especialista: ' + datos[i].especialista.nombre + " " + datos[i].especialista.apellido  ).alignment('left').margin(5).fontSize(12).bold().end
      );
      
      for(let j=0;j<datos[i].comentarios.length;j++){
        console.log(datos[i].comentarios[j]);
        pdf.add(
          new Txt(datos[i].comentarios[j]).alignment('center').fontSize(12).end,  
        );
      }
      
    }
    pdf.add(
      new Txt(' ').end
    );

    pdf.add(
      new Txt(' ').end
    );
    
    pdf.create().download("Historia_Clinica_"+nombreArchivo);
  }

  async generatePDFTurnos(datos:any,titulo:string,nombreArchivo:string){
    
  }

}
