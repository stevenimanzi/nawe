<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketplace_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('price');
            $table->enum('category', [
                'essentials',
                'electronics',
                'tvet_tools',
                'books',
                'clothing',
                'other',
            ]);
            $table->enum('condition', ['new', 'like_new', 'good', 'fair']);
            $table->enum('status', ['active', 'pending', 'sold', 'archived'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('seller_id');
            $table->index('status');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketplace_items');
    }
};
