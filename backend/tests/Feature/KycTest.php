<?php

namespace Tests\Feature;

use App\Models\KycVerification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class KycTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_submit_kyc_verification_documents(): void
    {
        Storage::fake('public');

        $user = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/kyc', [
            'document_type' => 'national_id',
            'id_number' => '1199880012345678',
            'full_name' => 'Kwizera Christian',
            'date_of_birth' => '1998-05-12',
            'id_front_image' => UploadedFile::fake()->create('id_front.jpg', 200, 'image/jpeg'),
            'id_back_image' => UploadedFile::fake()->create('id_back.jpg', 200, 'image/jpeg'),
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.id_number', '1199880012345678')
            ->assertJsonPath('data.document_type', 'national_id');

        $this->assertDatabaseHas('kyc_verifications', [
            'user_id' => $user->id,
            'id_number' => '1199880012345678',
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('kyc_audit_logs', [
            'action' => 'submitted',
            'actor_id' => $user->id,
            'new_status' => 'pending',
        ]);
    }

    public function test_unverified_seller_cannot_create_trade_item(): void
    {
        $seller = User::factory()->create(['role' => 'student']);
        Sanctum::actingAs($seller);

        $response = $this->postJson('/api/v1/trade/items', [
            'title' => 'MacBook Air M1',
            'description' => 'Clean laptop',
            'price' => 650000,
            'category' => 'electronics',
            'condition' => 'like_new',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('code', 'KYC_VERIFICATION_REQUIRED');
    }

    public function test_kyc_verified_seller_can_create_trade_item(): void
    {
        $seller = User::factory()->create(['role' => 'student']);

        KycVerification::create([
            'user_id' => $seller->id,
            'document_type' => 'national_id',
            'id_number' => '1199880012345678',
            'full_name' => $seller->name,
            'id_front_image_path' => 'kyc/ids/id_front.jpg',
            'status' => 'approved',
        ]);

        Sanctum::actingAs($seller);

        $response = $this->postJson('/api/v1/trade/items', [
            'title' => 'MacBook Air M1',
            'description' => 'Clean laptop',
            'price' => 650000,
            'category' => 'electronics',
            'condition' => 'like_new',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'MacBook Air M1')
            ->assertJsonPath('data.price', 650000);
    }

    public function test_admin_can_review_and_approve_kyc(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'student']);

        $kyc = KycVerification::create([
            'user_id' => $user->id,
            'document_type' => 'national_id',
            'id_number' => '1199880012345678',
            'full_name' => $user->name,
            'id_front_image_path' => 'kyc/ids/id_front.jpg',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson("/api/v1/kyc/{$kyc->id}/review", [
            'status' => 'approved',
            'notes' => 'Valid Rwandan National ID verified.',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('kyc_verifications', [
            'id' => $kyc->id,
            'status' => 'approved',
            'reviewed_by' => $admin->id,
        ]);

        $this->assertDatabaseHas('kyc_audit_logs', [
            'kyc_verification_id' => $kyc->id,
            'actor_id' => $admin->id,
            'action' => 'reviewed',
            'new_status' => 'approved',
        ]);
    }
}
