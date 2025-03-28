import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  template: `
    <div class="modal-body">
      <p>{{ mensaje }}</p>
    </div>
  `,
  styles: []
})
export class ErrorModalComponent {
  @Input() mensaje: string = '';  // Recibe el mensaje desde el componente principal
}
