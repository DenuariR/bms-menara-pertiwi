<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('password');
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        Schema::create('checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shift_id')->nullable()->constrained();
            $table->date('date');
            $table->string('kind');
            $table->unsignedTinyInteger('sesi')->default(1);
            $table->json('values');
            $table->string('status')->default('Sudah Diisi');
            $table->text('follow_up_note')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'date', 'kind', 'sesi']);
        });

        Schema::create('checklist_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('checklist_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained();
            $table->string('action'); // created | updated
            $table->json('changes')->nullable();
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checklist_histories');
        Schema::dropIfExists('checklists');
        Schema::dropIfExists('shifts');
        Schema::dropIfExists('users');
    }
};
