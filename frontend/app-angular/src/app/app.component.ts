import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlunoService } from './servides/aluno.service'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  nome: string = '';
  email: string = '';
  mensagem: string = '';
  alunoParaEditar: any = null; // Armazena o aluno que está sendo editado (para preencher o formulário)



  // Novas propriedades para exibir os alunos
  alunos: any[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;
  apiMessage: string | null = null;

  constructor(private alunoService: AlunoService) { }

  ngOnInit(): void {
    // Chame o método para carregar os alunos aqui
    this.carregarAlunos();
  }

  enviarFormulario() {
    this.mensagem = `Obrigado, ${this.nome}! Recebemos seu e-mail: ${this.email}`;
    this.nome = '';
    this.email = '';
  }

  // Novo método para carregar os alunos da API
  carregarAlunos(): void {
    this.loading = true;
    this.errorMessage = null;
    this.apiMessage = null; // Limpa mensagens anteriores
    this.alunoService.getAlunos().subscribe({
      next: (data) => {
        this.alunos = data;
        this.loading = false;
        console.log('Alunos carregados:', this.alunos);
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar alunos. Verifique o console para mais detalhes.';
        this.loading = false;
        console.error('Erro ao carregar alunos:', error);
        if (error.status === 0) {
          this.errorMessage += ' O servidor Laravel pode não estar rodando ou o CORS não está configurado.';
        } else if (error.status === 404) {
          this.errorMessage += ' Endpoint da API não encontrado.';
        }
      }
    });
  }


// Método para CRIAR ou ATUALIZAR um aluno
  salvarAluno(): void {
    this.apiMessage = null; // Limpa mensagens anteriores
    const alunoData = { nome: this.nome, email: this.email }; // Ajuste para os campos reais do seu Aluno

    if (this.alunoParaEditar) { // Se há um aluno em edição, é uma atualização (PUT)
      this.alunoService.atualizarAluno(this.alunoParaEditar.id, alunoData).subscribe({
        next: (response) => {
          this.apiMessage = 'Aluno atualizado com sucesso!';
          console.log('Aluno atualizado:', response);
          this.limparFormulario();
          this.carregarAlunos(); // Recarrega a lista para mostrar a atualização
        },
        error: (error) => {
          this.apiMessage = 'Erro ao atualizar aluno.';
          console.error('Erro ao atualizar aluno:', error);
        }
      });
    } else { // Caso contrário, é um novo cadastro (POST)
      this.alunoService.criarAluno(alunoData).subscribe({
        next: (response) => {
          this.apiMessage = 'Aluno cadastrado com sucesso!';
          console.log('Aluno cadastrado:', response);
          this.limparFormulario();
          this.carregarAlunos(); // Recarrega a lista para mostrar o novo aluno
        },
        error: (error) => {
          this.apiMessage = 'Erro ao cadastrar aluno.';
          console.error('Erro ao cadastrar aluno:', error);
        }
      });
    }
  }

  // Preenche o formulário com os dados de um aluno para edição
  editarAluno(aluno: any): void {
    this.alunoParaEditar = { ...aluno }; // Cria uma cópia para evitar modificações diretas
    this.nome = aluno.nome;
    this.email = aluno.email;
    this.apiMessage = `Editando aluno: ${aluno.nome}`;
  }

  // Remove um aluno
  removerAluno(id: number): void {
    this.apiMessage = null; // Limpa mensagens anteriores
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      this.alunoService.removerAluno(id).subscribe({
        next: (response) => {
          this.apiMessage = 'Aluno removido com sucesso!';
          console.log('Aluno removido:', response);
          this.carregarAlunos(); // Recarrega a lista após a remoção
        },
        error: (error) => {
          this.apiMessage = 'Erro ao remover aluno.';
          console.error('Erro ao remover aluno:', error);
        }
      });
    }
  }



   // Limpa o formulário e o estado de edição
  limparFormulario(): void {
    this.nome = '';
    this.email = '';
    this.alunoParaEditar = null;
    this.mensagem = ''; // Limpa mensagem do formulário local
  }
}
