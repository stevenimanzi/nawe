<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('housing_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('landlord_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('monthly_rent');
            $table->unsignedInteger('deposit');
            $table->unsignedTinyInteger('rooms')->default(1);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('address')->nullable();
            $table->enum('status', ['available', 'rented', 'paused'])->default('available');
            $table->timestamps();
            $table->softDeletes();

            $table->index('landlord_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('housing_listings');
    }
};
