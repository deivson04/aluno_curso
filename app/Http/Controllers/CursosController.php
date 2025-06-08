<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Http\Request;

class CursosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cursos = Curso::all();

        return response()->json($cursos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
        ]);

        $curso = Curso::create([
            'id_aluno' => $request->input('id_aluno'),
            'titulo' => $request->input('titulo'),
            'descricao' => $request->input('descricao'),
        ]);

        return response()->json([
            'mensagem' => 'Curso cadastrado com sucesso',

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $curso = Curso::findOrFail($id);

        return response()->json($curso);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $cursos = Curso::find($id);
        
        $cursos->id_curso = $request->input('id_curso');
        $cursos->titulo = $request->input('titulo');
        $cursos->descricao = $request->input('descricao');

        $cursos->save();

        return response()->json(['message' => 'Curso atualizado com sucesso!']);
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $curso = Curso::findOrFail($id);
        $curso->delete();

        return response()->json(['message' => 'Curso deletado com sucesso!']);
    }
}
