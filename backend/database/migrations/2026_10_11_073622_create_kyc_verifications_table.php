<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kyc_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('document_type', [
                'national_id',
                'student_id',
                'passport',
                'driving_license',
            ])->default('national_id');
            $table->string('id_number', 50)->index();
            $table->string('full_name');
            $table->date('date_of_birth')->nullable();
            $table->string('id_front_image_path');
            $table->string('id_back_image_path')->nullable();
            $table->string('selfie_with_id_path')->nullable();
            $table->enum('status', [
                'pending',
                'in_review',
                'approved',
                'rejected',
            ])->default('pending')->index();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
            $table->softDeletes();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kyc_verifications');
    }
};
