<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kyc_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kyc_verification_id')
                ->constrained('kyc_verifications')
                ->cascadeOnDelete();
            $table->foreignId('actor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('action', 50);
            $table->string('previous_status', 30)->nullable();
            $table->string('new_status', 30);
            $table->text('notes')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();

            $table->index(['kyc_verification_id', 'action']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kyc_audit_logs');
    }
};
