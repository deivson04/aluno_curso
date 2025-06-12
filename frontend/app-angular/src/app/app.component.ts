import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  nome: string = '';
  email: string = '';
  mensagem: string = '';

  enviarFormulario() {
    this.mensagem = `Obrigado, ${this.nome}! Recebemos seu e-mail: ${this.email}`;
    this.nome = '';
    this.email = '';
  }
}
