<?php

use App\Http\Controllers\CursosController;
use App\Http\Controllers\AlunosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/curso', [CursosController::class, 'index']);
Route::post('/curso/criar', [CursosController::class, 'store']);
Route::put('/curso/editar/{id}', [CursosController::class, 'update']);
Route::get('/curso/visualizar/{id}', [CursosController::class, 'show']);
Route::delete('/curso/remover/{id}', [CursosController::class, 'destroy']);


Route::get('/aluno', [AlunosController::class, 'index']);
Route::post('/aluno/criar', [AlunosController::class, 'store']);
Route::put('/aluno/editar/{id}', [AlunosController::class, 'update']);
Route::get('/aluno/visualizar/{id}', [AlunosController::class, 'show']);
Route::delete('/aluno/remover/{id}', [AlunosController::class, 'destroy']);

Route::get('/aluno/buscar', [AlunosController::class, 'buscarNomeEmail']);
Route::get('/aluno/buscarAvancada', [AlunosController::class, 'buscaAvancada']);


