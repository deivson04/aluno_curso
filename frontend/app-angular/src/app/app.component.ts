import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlunoService } from './services/aluno.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  // Adicione styleUrls se você tiver um arquivo CSS para o componente
  // styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Variáveis para o formulário de Cadastro/Edição da API
  alunoForm = { // Objeto para agrupar os dados do formulário da API
    nome: '',
    email: '',
    sexo: '',
    dataNascimento: ''
  };
  alunoParaEditar: any = null; // Armazena o aluno que está sendo editado (para preencher o formulário)

  // Variáveis para o Formulário Local (Exemplo Antigo) - CORREÇÃO AQUI!
  localNome: string = ''; // <-- Adicione esta linha
  localEmail: string = ''; // <-- Adicione esta linha
  localSexo: string = ''; // <-- Adicione esta linha
  localDataNascimento: string = ''; // <-- Adicione esta linha
  localMensagem: string = ''; // Variável para a mensagem do formulário local


  // Novas propriedades para exibir os alunos
  alunos: any[] = [];
  errorMessage: string | null = null; // Para erros gerais de carregamento
  loading: boolean = true;
  apiMessage: string | null = null; // Para mensagens de feedback da API (sucesso/erro de validação)

  constructor(private alunoService: AlunoService) { }

  ngOnInit(): void {
    this.carregarAlunos(); // Carrega os alunos ao iniciar o componente
  }

  // Método para enviar o Formulário Local (Exemplo Antigo)
  enviarFormularioLocal(): void {
    this.localMensagem = `Obrigado, ${this.localNome}! Recebemos seu e-mail: ${this.localEmail}`;
    this.localNome = '';
    this.localEmail = '';
  }

  // Getter para formatar a mensagem da API
  get renderedApiMessage(): string | null {
    if (this.apiMessage) {
      return this.apiMessage.replace(/\n/g, '<br>');
    }
    return null;
  }


  // --- Métodos de Interação com a API ---

  carregarAlunos(): void {
    this.loading = true;
    this.errorMessage = null;
    this.apiMessage = null; // Limpa mensagens anteriores da API
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
          this.errorMessage += ' Endpoint da API de listagem não encontrado.';
        } else {
            this.errorMessage += ` Status: ${error.status}. Mensagem: ${error.message || 'Erro desconhecido.'}`;
        }
      }
    });
  }


  // Método para CRIAR ou ATUALIZAR um aluno
  salvarAluno(): void {
    this.apiMessage = null;
    const alunoData = { nome: this.alunoForm.nome, email: this.alunoForm.email,  sexo: this.alunoForm.sexo,  dataNascimento: this.alunoForm.dataNascimento };

    if (this.alunoParaEditar) {
      this.alunoService.atualizarAluno(this.alunoParaEditar.id_aluno, alunoData).subscribe({
        next: (response) => {
          this.apiMessage = 'Aluno atualizado com sucesso!';
          console.log('Aluno atualizado:', response);
          this.limparFormularioAPI();
          this.carregarAlunos();
        },
        error: (error) => {
          this.apiMessage = 'Erro ao atualizar aluno.';
          console.error('Erro ao atualizar aluno:', error);
          this.handleApiError(error, 'atualizar');
        }
      });
    } else {
      this.alunoService.criarAluno(alunoData).subscribe({
        next: (response) => {
          this.apiMessage = 'Aluno cadastrado com sucesso!';
          console.log('Aluno cadastrado:', response);
          this.limparFormularioAPI();
          this.carregarAlunos();
        },
        error: (error) => {
          this.apiMessage = 'Erro ao cadastrar aluno.';
          console.error('Erro ao cadastrar aluno:', error);
          this.handleApiError(error, 'cadastrar');
        }
      });
    }
  }

  // Preenche o formulário da API com os dados de um aluno para edição
  editarAluno(aluno: any): void {
    this.alunoParaEditar = { ...aluno };
    this.alunoForm.nome = aluno.nome;
    this.alunoForm.email = aluno.email;
    this.alunoForm.sexo = aluno.sexo; 
    this.alunoForm.dataNascimento = aluno.dataNascimento; 
    this.apiMessage = `Editando aluno: ${aluno.nome}`;
  }

  // Remove um aluno
  removerAluno(id: number): void {
    this.apiMessage = null;
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      this.alunoService.removerAluno(id).subscribe({
        next: (response) => {
          this.apiMessage = 'Aluno removido com sucesso!';
          console.log('Aluno removido:', response);
          this.carregarAlunos();
        },
        error: (error) => {
          this.apiMessage = 'Erro ao remover aluno.';
          console.error('Erro ao remover aluno:', error);
          this.handleApiError(error, 'remover');
        }
      });
    }
  }

  // Limpa o formulário da API e o estado de edição
  limparFormularioAPI(): void {
    this.alunoForm.nome = '';
    this.alunoForm.email = '';
     this.alunoForm.sexo = ''; 
    this.alunoForm.dataNascimento = '';
    this.alunoParaEditar = null;
    this.apiMessage = null;
  }

  // Método genérico para tratar erros da API, incluindo validação
  private handleApiError(error: any, operation: string): void {
    let baseMessage = `Erro ao ${operation} aluno:`;
    this.apiMessage = baseMessage;

    if (error.status === 422 && error.error && error.error.errors) {
      let validationErrors = error.error.errors;
      let detailedMessage = '\nDetalhes da Validação:';
      for (const field in validationErrors) {
        if (validationErrors.hasOwnProperty(field)) {
          detailedMessage += `\n- ${field}: ${validationErrors[field].join(', ')}`;
        }
      }
      this.apiMessage = baseMessage + detailedMessage;
      console.log('Erro de validação recebido:', validationErrors);
    } else if (error.status === 0) {
        this.apiMessage = baseMessage + ' O servidor Laravel pode não estar rodando ou o CORS não está configurado corretamente.';
    } else if (error.status === 404) {
        this.apiMessage = baseMessage + ' Endpoint da API não encontrado.';
    } else if (error.error && error.error.message) {
      this.apiMessage = baseMessage + ` ${error.error.message}`;
    } else {
      this.apiMessage = baseMessage + ` Ocorreu um erro desconhecido (Status: ${error.status || 'N/A'}). Verifique o console.`;
    }
  }
}
