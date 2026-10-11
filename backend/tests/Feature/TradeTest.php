<?php

namespace Tests\Feature;

use App\Models\KycVerification;
use App\Models\MarketplaceItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TradeTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_and_filter_trade_items(): void
    {
        $seller = User::factory()->create(['role' => 'student']);
        $buyer = User::factory()->create(['role' => 'student']);

        MarketplaceItem::create([
            'seller_id' => $seller->id,
            'title' => 'TVET Soldering Station',
            'description' => 'For electronics workshops',
            'price' => 15000,
            'category' => 'tvet_tools',
            'condition' => 'good',
            'status' => 'active',
        ]);

        MarketplaceItem::create([
            'seller_id' => $seller->id,
            'title' => 'Electric Kettle',
            'description' => 'Hostel kettle',
            'price' => 10000,
            'category' => 'essentials',
            'condition' => 'like_new',
            'status' => 'active',
        ]);

        Sanctum::actingAs($buyer);

        $responseAll = $this->getJson('/api/v1/trade/items');
        $responseAll->assertStatus(200)
            ->assertJsonCount(2, 'data');

        $responseFiltered = $this->getJson('/api/v1/trade/items?category=tvet_tools');
        $responseFiltered->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'TVET Soldering Station');
    }

    public function test_student_can_create_trade_item(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        KycVerification::create([
            'user_id' => $student->id,
            'document_type' => 'national_id',
            'id_number' => '1200180012345678',
            'full_name' => $student->name,
            'id_front_image_path' => 'kyc/ids/front.jpg',
            'status' => 'approved',
        ]);

        Sanctum::actingAs($student);

        $response = $this->postJson('/api/v1/trade/items', [
            'title' => 'Digital Vernier Caliper',
            'description' => 'Mechanical measurement instrument',
            'price' => 12000,
            'category' => 'tvet_tools',
            'condition' => 'like_new',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Digital Vernier Caliper')
            ->assertJsonPath('data.price', 12000);

        $this->assertDatabaseHas('marketplace_items', [
            'title' => 'Digital Vernier Caliper',
            'category' => 'tvet_tools',
        ]);
    }
}
