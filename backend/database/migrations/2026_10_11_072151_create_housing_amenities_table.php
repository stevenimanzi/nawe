<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('housing_amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('housing_listing_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->boolean('has_water')->default(false);
            $table->boolean('has_wifi')->default(false);
            $table->boolean('has_electricity')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->boolean('is_furnished')->default(false);
            $table->unsignedSmallInteger('distance_to_campus_meters')->nullable();
            $table->timestamps();

            $table->unique('housing_listing_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('housing_amenities');
    }
};
