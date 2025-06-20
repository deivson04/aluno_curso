import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = 'http://localhost:8000/api'; // Sua URL da API Laravel

  constructor(private http: HttpClient) { }

  getAlunos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/aluno`);
  }

  criarAluno(aluno: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/aluno/criar`, aluno);
  }

  getAluno(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/aluno/visualizar${id}`);
  }

  atualizarAluno(id: number, aluno: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/aluno/editar/${id}`, aluno);
  }
  removerAluno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/aluno/remover/${id}`);
  }
}