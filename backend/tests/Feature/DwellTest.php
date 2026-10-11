<?php

namespace Tests\Feature;

use App\Models\HousingAmenity;
use App\Models\HousingListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DwellTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_dwell_listings(): void
    {
        $landlord = User::factory()->create(['role' => 'landlord']);
        $student = User::factory()->create(['role' => 'student']);

        $listing = HousingListing::create([
            'landlord_id' => $landlord->id,
            'title' => 'Musanze Gueto Near Campus',
            'description' => 'Clean single room',
            'monthly_rent' => 30000,
            'deposit' => 30000,
            'rooms' => 1,
            'status' => 'available',
        ]);

        HousingAmenity::create([
            'housing_listing_id' => $listing->id,
            'has_water' => true,
            'has_wifi' => true,
            'distance_to_campus_meters' => 300,
        ]);

        Sanctum::actingAs($student);

        $response = $this->getJson('/api/v1/dwell/listings');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Musanze Gueto Near Campus')
            ->assertJsonPath('data.0.amenities.has_water', true);
    }

    public function test_landlord_can_create_housing_listing(): void
    {
        $landlord = User::factory()->create(['role' => 'landlord']);
        Sanctum::actingAs($landlord);

        $response = $this->postJson('/api/v1/dwell/listings', [
            'title' => 'New 2-Room Apartment',
            'description' => 'Walking distance to RP Musanze',
            'monthly_rent' => 50000,
            'deposit' => 50000,
            'rooms' => 2,
            'latitude' => -1.4988,
            'longitude' => 29.6335,
            'has_water' => true,
            'has_wifi' => false,
            'distance_to_campus_meters' => 400,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'New 2-Room Apartment')
            ->assertJsonPath('data.monthly_rent', 50000);

        $this->assertDatabaseHas('housing_listings', [
            'title' => 'New 2-Room Apartment',
            'monthly_rent' => 50000,
        ]);
    }
}
