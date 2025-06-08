<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aluno extends Model
{
    
    protected $fillable = ['nome', 'email', 'sexo', 'dataNascimento'];
    protected $primaryKey = 'id_aluno';
}
