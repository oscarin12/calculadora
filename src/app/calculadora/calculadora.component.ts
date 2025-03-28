import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Asegúrate de importar NgbModal
import { TemplateRef } from '@angular/core';  // Importa TemplateRef para trabajar con el modal

@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent {
  display: string = '';
  botones: string[] = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.',  '+','√'
  ];

  mensajeError: string = '';  // Mensaje de error para el modal

  // Asegúrate de usar ViewChild para acceder al template del modal
  @ViewChild('errorModal') errorModal!: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}  // Inyectamos el servicio NgbModal

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const tecla = event.key;

    if ('0123456789/*-+.' .includes(tecla)) {
      this.onPress(tecla);  
    }

    if (tecla === 'Enter') {
      this.onPress('=');
    }

    if (tecla === 'Backspace' || tecla === 'Escape') {
      this.limpiar();
    }

    if (tecla === '√') {
      this.onPress('√');
    }
  }

  onPress(valor: string) {
    if (valor === '=') {
      this.calcular();
    } else if (valor === '√') {
      this.display = '√' + this.display;
    } else {
      this.display += valor;
    }
  }

  calcular() {
    try {
      
      
      // Validar si el display termina en un punto
    if (this.display.endsWith('.')) {
      this.display = this.display.slice(0, -1);  // Eliminar el punto final
    }
      
      let operacion = this.display.replace('√', 'Math.sqrt(');
  
      if (operacion.includes('Math.sqrt(')) {
        operacion += ')';
      }

      console.log("Operación a evaluar: ", operacion);

      let resultado = this.evaluarOperacion(operacion);

      if (!isFinite(resultado)) {
        this.display = 'Error inesperado o colocaste el cero';
        this.mensajeError = 'Error inesperado o colocaste el cero';
        this.mostrarError();  // Mostrar el error en el modal
      } else {
        this.display = String(resultado);
      }
    } catch (e: any) {  
      console.error('Error en el cálculo: ' + e.message);  
      this.display = 'Error';  
      this.mensajeError = 'Error en el cálculo';
      this.mostrarError();
    }
  }

  evaluarOperacion(operacion: string): number {
    const regex = /^[0-9+\-*/().^√\sMath.sqrt]+$/;

    if (!regex.test(operacion)) {
      throw new Error("Operación no válida");
    }

    return new Function('return ' + operacion)();
  }

  limpiar() {
    this.display = '';
  }

  mostrarError() {
    // Abre el modal de error
    this.modalService.open(this.errorModal);
  }
}
