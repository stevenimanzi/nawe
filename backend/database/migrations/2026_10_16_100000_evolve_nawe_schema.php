<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Roles and categories become plain strings so they can grow without schema changes.
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 20)->default('member')->change();
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->string('category', 30)->change();
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->string('listing_type', 10)->default('sale')->after('category');
            $table->string('rent_period', 10)->nullable()->after('listing_type');
            $table->string('location', 100)->nullable()->after('condition');
            $table->decimal('latitude', 10, 7)->nullable()->after('location');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->boolean('is_urgent')->default(false)->after('longitude');
            $table->index('listing_type');
            $table->index('location');
            $table->index('is_urgent');
        });

        Schema::table('housing_listings', function (Blueprint $table) {
            $table->string('location', 100)->nullable()->after('address');
            $table->string('property_type', 20)->default('room')->after('location');
            $table->index('location');
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->morphs('favoritable');
            $table->timestamps();
            $table->unique(['user_id', 'favoritable_type', 'favoritable_id']);
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->string('reportable_type')->nullable();
            $table->unsignedBigInteger('reportable_id')->nullable();
            $table->string('reason', 40);
            $table->text('details')->nullable();
            $table->string('status', 20)->default('open');
            $table->timestamps();
            $table->index(['reportable_type', 'reportable_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('favorites');

        Schema::table('housing_listings', function (Blueprint $table) {
            $table->dropIndex(['location']);
            $table->dropColumn(['location', 'property_type']);
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->dropIndex(['listing_type']);
            $table->dropIndex(['location']);
            $table->dropIndex(['is_urgent']);
            $table->dropColumn(['listing_type', 'rent_period', 'location', 'latitude', 'longitude', 'is_urgent']);
        });
    }
};
