import { Injectable } from '@angular/core';
import { PdfMakeWrapper, Txt, Img, Table,Cell  } from 'pdfmake-wrapper';
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
      let nroTurno:number = i+1;
      pdf.add(
        new Txt('Historia Clinica NRO ' + nroTurno).alignment('center').color('red').margin(30).fontSize(20).end 
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

  async generatePDFTurnos(datos:any,titulo:string,nombreArchivo:string,usuarioActual:any){
    let pdf = new PdfMakeWrapper();
    let fechaActual = new Date();
    pdf.add( 
      await new Img('assets/favicon_io/android-chrome-512x512.png').fit([100, 100]).alignment('center').build()
    );
    pdf.add(
      new Txt(titulo).alignment('center').margin(40).fontSize(50).bold().end, 
    );

    pdf.add(
      new Txt('Especialista: ' +nombreArchivo).alignment('right').fontSize(12).bold().italics().color('gray').end, 
    )

    pdf.add(
      new Txt('Fecha de Hoy: ' + fechaActual.toDateString()).alignment('right').fontSize(12).bold().italics().color('gray').end, 
    )
    
    for(let i=0;i<datos.length;i++){
      let nroTurno:number = i+1;
      pdf.add(
      
        new Txt('Turno NRO ' + nroTurno).alignment('center').color('red').margin(30).fontSize(20).end 
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
        new Txt(datos[i].comentarioEspecialista ? 'Comentario Especialista: ' + datos[i].comentarioEspecialista : 'Comentario Especialista: No hay').alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt(datos[i].comentarioPaciente ? 'Comentario Paciente: ' + datos[i].comentarioPaciente: 'Comentario Paciente: No hay ').alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt(datos[i].comentarioAdmin ? 'Comentario Hospital: ' + datos[i].comentarioAdmin: 'Comentario Hospital: No hay').alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt(datos[i].calificacion > 0 ? 'Calificación: ' + datos[i].calificacion : 'Calificación: Sin calificar').alignment('left').margin(5).fontSize(12).end
      );

      pdf.add(
        new Txt('Paciente: ' + datos[i].paciente.nombre + " " + datos[i].paciente.apellido).alignment('left').margin(5).fontSize(15).bold().end
      );
  
    }
    pdf.add(
      new Txt(' ').end
    );

    pdf.add(
      new Txt(' ').end
    );
    
    pdf.create().download("Turnos_de_"+nombreArchivo);
  }

  async generatePDFEstadisticas(datos:any,titulo:string,nombreArchivo:string){
    let pdf = new PdfMakeWrapper();
    let fechaActual = new Date();
    pdf.add( 
      await new Img('assets/favicon_io/android-chrome-512x512.png').fit([100, 100]).alignment('center').build()
    );
    pdf.add(
      new Txt(titulo).alignment('center').margin(40).fontSize(50).bold().end, 
    );

    pdf.add(
      new Txt(' ').end
    );

    pdf.add(
      new Txt(' ').end
    );

    pdf.add(
      new Txt('Fecha de Hoy: ' + fechaActual.toDateString()).alignment('right').fontSize(12).bold().italics().color('gray').end, 
    );

    pdf.add(
      new Txt(' ').end
    );

    pdf.add(
      new Txt('Turnos por Dia: ' + datos.cantTurnosPorDia).margin(5).alignment('left').fontSize(13).end, 
    );

    pdf.add(
      new Txt('Turnos Solicitados esta Semana: ' + datos.cantTurnosSolicitados).margin(5).alignment('left').fontSize(13).end, 
    );

    pdf.add(
      new Txt('Turnos Finalizados esta Semana: ' + datos.cantTurnosFinalizados).margin(5).alignment('left').fontSize(13).end, 
    );

    pdf.add(
      new Txt(' ').end
    );

    pdf.add(
      new Txt('Total Turnos por Especialidad: ').alignment('center').margin(10).fontSize(13).color('red').bold().end, 
    );

    for(let i = 0; i<datos.cantTurnosEspecialidades.length;i++){
      pdf.add(
        new Txt(datos.cantTurnosEspecialidades[i].nombre +': '+datos.cantTurnosEspecialidades[i].cantidadTurnos).margin(2).alignment('left').fontSize(13).end, 
      );
    }
    pdf.add(
      new Txt(' ').end
    );

    pdf.add(
      new Txt(' ').end
    );
    
    pdf.create().download("Turnos_de_"+nombreArchivo);
  }

}
