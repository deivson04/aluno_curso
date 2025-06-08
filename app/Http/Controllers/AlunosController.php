<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AlunosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $alunos = Aluno::all();

        return response()->json($alunos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'nullable|string',
            'sexo' => 'nullable|string',
            'dataNascimento' => 'nullable|string',
        ]);

        $alunos = Aluno::create([
            'nome' => $request->input('nome'),
            'email' => $request->input('email'),
            'sexo' => $request->input('sexo'),
            'dataNascimento' => $request->input('dataNascimento'),
        ]);

        return response()->json([
            'mensagem' => 'Aluno cadastrado com sucesso',

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $aluno = Aluno::findOrFail($id);

        return response()->json($aluno);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $alunos = Aluno::find($id);

        $alunos->id_aluno = $request->input('id_aluno');
        $alunos->nome = $request->input('nome');
        $alunos->email = $request->input('email');
        $alunos->sexo = $request->input('sexo');
        $alunos->dataNascimento = $request->input('dataNascimento');

        $alunos->save();

        return response()->json(['message' => 'Aluno atualizado com sucesso!']);
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $aluno = Aluno::findOrFail($id);
        $aluno->delete();

        return response()->json(['message' => 'Curso deletado com sucesso!']);
    }

    // buscar alunos por nome e email

    public function buscarNomeEmail(Request $request)
    {
        $nome = $request->query('nome');
        $email = $request->query('email');

        $busca = Aluno::where('nome', $nome)
            ->where('email', $email)
            ->get();
        return response()->json($busca);
    }

    // buscar por curso e sexo usando query builder

    public function buscaAvancada()
    {

        $dados = DB::table('alunos as a')
            ->join('cursos as c', 'c.id_aluno', '=', 'a.id_aluno')
            ->select(
                'a.sexo',
                'c.titulo as curso',
                DB::raw('SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) < 15 THEN 1 ELSE 0 END) AS faixa_menor'),
                DB::raw('SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) BETWEEN 15 AND 18 THEN 1 ELSE 0 END) AS faixa_15_18'),
                DB::raw('SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) BETWEEN 19 AND 24 THEN 1 ELSE 0 END) AS faixa_19_24'),
                DB::raw('SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) BETWEEN 25 AND 30 THEN 1 ELSE 0 END) AS faixa_25_30'),
                DB::raw('SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) > 30 THEN 1 ELSE 0 END) AS faixa_maior_30')
            )

            ->groupBy('a.sexo', 'c.titulo')
            ->orderBy('c.titulo')
            ->orderBy('a.sexo')
            ->get();

            return response()->json($dados);

        // query usando sql em php 
        //      $sql = "
        //     SELECT 
        //         a.sexo,
        //         c.titulo AS curso,
        //         SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) < 15 THEN 1 ELSE 0 END) AS faixa_menor_15,
        //         SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) BETWEEN 15 AND 18 THEN 1 ELSE 0 END) AS faixa_15_18,
        //         SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) BETWEEN 19 AND 24 THEN 1 ELSE 0 END) AS faixa_19_24,
        //         SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) BETWEEN 25 AND 30 THEN 1 ELSE 0 END) AS faixa_25_30,
        //         SUM(CASE WHEN TIMESTAMPDIFF(YEAR, a.dataNascimento, CURDATE()) > 30 THEN 1 ELSE 0 END) AS faixa_maior_30
        //     FROM alunos a
        //     INNER JOIN cursos c ON c.id_aluno = a.id_aluno
        //      GROUP BY a.sexo, c.titulo ORDER BY c.titulo, a.sexo
        // ";

        //     $resultado = DB::select($sql);
        //return response()->json($resultado);
    }
}
