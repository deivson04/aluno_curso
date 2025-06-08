<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('alunos', function (Blueprint $table) {
            $table->increments('id_aluno');       
            $table->string('nome', 50);           
            $table->string('email', 50);          
            $table->string('sexo', 10)->nullable(); 
            $table->date('dataNascimento');       
            $table->timestamps();                 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alunos');
    }
};