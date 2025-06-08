<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{

    protected $fillable = ['id_aluno', 'titulo', 'descricao'];
    protected $primaryKey = 'id_curso';

}
