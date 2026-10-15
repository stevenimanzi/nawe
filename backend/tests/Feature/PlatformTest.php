<?php

namespace Tests\Feature;

use App\Models\HousingAmenity;
use App\Models\HousingListing;
use App\Models\KycVerification;
use App\Models\MarketplaceItem;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlatformTest extends TestCase
{
    use RefreshDatabase;

    /** A real 1x1 PNG, so the tests do not depend on the GD extension. */
    private function png(string $name): UploadedFile
    {
        $bytes = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');

        return UploadedFile::fake()->createWithContent($name, $bytes);
    }

    private function item(User $seller, array $overrides = []): MarketplaceItem
    {
        return MarketplaceItem::create([
            'seller_id' => $seller->id,
            'title' => 'Used phone',
            'description' => 'Works well',
            'price' => 50000,
            'category' => 'phones',
            'condition' => 'good',
            'status' => 'active',
            ...$overrides,
        ]);
    }

    private function home(User $landlord, array $overrides = [], array $amenities = []): HousingListing
    {
        $listing = HousingListing::create([
            'landlord_id' => $landlord->id,
            'title' => 'Room',
            'description' => 'Nice',
            'monthly_rent' => 40000,
            'deposit' => 40000,
            'rooms' => 1,
            'status' => 'available',
            ...$overrides,
        ]);
        HousingAmenity::create(['housing_listing_id' => $listing->id, ...$amenities]);

        return $listing;
    }

    /* ---------- Public browsing ---------- */

    public function test_visitors_can_browse_listings_without_an_account(): void
    {
        $seller = User::factory()->create(['phone' => '+250788111222']);
        $item = $this->item($seller);
        $listing = $this->home($seller);

        $this->getJson('/api/v1/trade/items')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson("/api/v1/trade/items/{$item->id}")->assertOk()->assertJsonPath('data.title', 'Used phone');
        $this->getJson('/api/v1/dwell/listings')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson("/api/v1/dwell/listings/{$listing->id}")->assertOk();
    }

    public function test_phone_numbers_are_hidden_from_visitors_but_shown_to_members(): void
    {
        $seller = User::factory()->create(['phone' => '+250788111222']);
        $item = $this->item($seller);

        $this->getJson("/api/v1/trade/items/{$item->id}")
            ->assertJsonPath('data.seller.phone', null)
            ->assertJsonMissingPath('data.seller.email');

        Sanctum::actingAs(User::factory()->create());

        $this->getJson("/api/v1/trade/items/{$item->id}")
            ->assertJsonPath('data.seller.phone', '+250788111222');
    }

    public function test_items_can_be_searched_and_filtered(): void
    {
        $seller = User::factory()->create();
        $this->item($seller, ['title' => 'Samsung phone', 'location' => 'Musanze']);
        $this->item($seller, ['title' => 'Wooden table', 'category' => 'furniture', 'location' => 'Kigali', 'price' => 90000]);
        $this->item($seller, ['title' => 'Washing machine', 'category' => 'appliances', 'listing_type' => 'rent', 'rent_period' => 'day', 'price' => 5000]);
        $this->item($seller, ['title' => 'Old sofa', 'category' => 'furniture', 'is_urgent' => true]);

        $this->getJson('/api/v1/trade/items?q=samsung')->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/trade/items?location=Kigali')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Wooden table');
        $this->getJson('/api/v1/trade/items?category=rentals')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Washing machine');
        $this->getJson('/api/v1/trade/items?urgent=1')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Old sofa');
        $this->getJson('/api/v1/trade/items?max_price=6000')->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/trade/items?sort=price_desc')->assertJsonPath('data.0.title', 'Wooden table');
    }

    public function test_items_can_be_sorted_by_distance_and_limited_by_radius(): void
    {
        $seller = User::factory()->create();
        $this->item($seller, ['title' => 'Far', 'latitude' => -1.9441, 'longitude' => 30.0619]);     // Kigali
        $this->item($seller, ['title' => 'Near', 'latitude' => -1.5000, 'longitude' => 29.6340]);    // Musanze
        $this->item($seller, ['title' => 'Nowhere']);

        $response = $this->getJson('/api/v1/trade/items?sort=nearest&lat=-1.4994&lng=29.6335')->assertOk();
        $this->assertSame(['Near', 'Far', 'Nowhere'], collect($response->json('data'))->pluck('title')->all());
        $this->assertLessThan(1, $response->json('data.0.distance_km'));

        $this->getJson('/api/v1/trade/items?lat=-1.4994&lng=29.6335&radius=10')
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Near');
    }

    public function test_housing_filters_by_amenities_rooms_location_and_radius(): void
    {
        $landlord = User::factory()->create(['role' => 'landlord']);
        $this->home($landlord, ['title' => 'A', 'rooms' => 1, 'location' => 'Musanze', 'latitude' => -1.50, 'longitude' => 29.63], ['has_water' => true, 'has_wifi' => true]);
        $this->home($landlord, ['title' => 'B', 'rooms' => 4, 'location' => 'Kigali', 'latitude' => -1.94, 'longitude' => 30.06], ['has_water' => true]);
        $this->home($landlord, ['title' => 'C', 'rooms' => 5, 'location' => 'Kigali'], ['has_parking' => true]);

        $this->getJson('/api/v1/dwell/listings?amenities=water')->assertJsonCount(2, 'data');
        $this->getJson('/api/v1/dwell/listings?amenities=water,wifi')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'A');
        $this->getJson('/api/v1/dwell/listings?rooms=4')->assertJsonCount(2, 'data'); // 4 means "4 or more"
        $this->getJson('/api/v1/dwell/listings?location=Kigali')->assertJsonCount(2, 'data');
        $this->getJson('/api/v1/dwell/listings?lat=-1.4994&lng=29.6335&radius=15')
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'A');
        $this->getJson('/api/v1/dwell/listings?per_page=2')->assertJsonCount(2, 'data')->assertJsonPath('meta.per_page', 2);
    }

    /* ---------- Posting ---------- */

    public function test_a_rental_needs_a_rent_period(): void
    {
        $user = User::factory()->create();
        KycVerification::create([
            'user_id' => $user->id, 'document_type' => 'national_id', 'id_number' => '1',
            'full_name' => 'A', 'id_front_image_path' => 'x', 'status' => 'approved',
        ]);
        Sanctum::actingAs($user);

        $base = ['title' => 'Suit', 'description' => 'Navy suit', 'price' => 8000, 'category' => 'clothing', 'condition' => 'good', 'listing_type' => 'rent'];

        $this->postJson('/api/v1/trade/items', $base)->assertStatus(422)->assertJsonValidationErrors('rent_period');
        $this->postJson('/api/v1/trade/items', [...$base, 'rent_period' => 'day', 'location' => 'Musanze'])
            ->assertCreated()
            ->assertJsonPath('data.listing_type', 'rent')
            ->assertJsonPath('data.rent_period', 'day');
    }

    public function test_unverified_members_cannot_post_items(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/trade/items', [
            'title' => 'Phone', 'description' => 'x', 'price' => 1000, 'category' => 'phones', 'condition' => 'good',
        ])->assertForbidden()->assertJsonPath('code', 'KYC_VERIFICATION_REQUIRED');
    }

    public function test_only_landlords_can_list_housing(): void
    {
        $payload = ['title' => 'Room', 'description' => 'x', 'monthly_rent' => 30000, 'deposit' => 0, 'rooms' => 1, 'location' => 'Musanze'];

        Sanctum::actingAs(User::factory()->create(['role' => 'member']));
        $this->postJson('/api/v1/dwell/listings', $payload)->assertForbidden()->assertJsonPath('code', 'LANDLORD_ROLE_REQUIRED');

        Sanctum::actingAs(User::factory()->create(['role' => 'landlord']));
        $this->postJson('/api/v1/dwell/listings', $payload)->assertCreated()->assertJsonPath('data.location', 'Musanze');
    }

    public function test_owners_can_upload_and_remove_photos_but_others_cannot(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create();
        $item = $this->item($owner);

        Sanctum::actingAs(User::factory()->create());
        $this->postJson("/api/v1/trade/items/{$item->id}/images", [
            'images' => [$this->png('a.png')],
        ])->assertForbidden();

        Sanctum::actingAs($owner);
        $response = $this->postJson("/api/v1/trade/items/{$item->id}/images", [
            'images' => [$this->png('a.png'), $this->png('b.png')],
        ])->assertCreated()->assertJsonCount(2, 'data');

        $imageId = $response->json('data.0.id');
        $path = $response->json('data.0.path');
        Storage::disk('public')->assertExists($path);

        $this->deleteJson("/api/v1/trade/items/{$item->id}/images/{$imageId}")->assertOk();
        Storage::disk('public')->assertMissing($path);

        $this->postJson("/api/v1/trade/items/{$item->id}/images", ['images' => [UploadedFile::fake()->create('doc.pdf', 10, 'application/pdf')]])
            ->assertStatus(422);
    }

    public function test_owner_can_mark_an_item_sold_and_it_leaves_the_listing(): void
    {
        $owner = User::factory()->create();
        $item = $this->item($owner);
        Sanctum::actingAs($owner);

        $this->patchJson("/api/v1/trade/items/{$item->id}", ['status' => 'sold'])->assertOk();
        $this->getJson('/api/v1/trade/items')->assertJsonCount(0, 'data');
        $this->getJson('/api/v1/me/listings')->assertJsonCount(1, 'data.items');
    }

    /* ---------- Favorites ---------- */

    public function test_favorites_can_be_added_listed_and_removed(): void
    {
        $seller = User::factory()->create();
        $item = $this->item($seller);
        $home = $this->home($seller);
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/favorites', ['type' => 'marketplace_item', 'id' => $item->id])->assertCreated();
        $this->postJson('/api/v1/favorites', ['type' => 'marketplace_item', 'id' => $item->id])->assertCreated(); // idempotent
        $this->postJson('/api/v1/favorites', ['type' => 'housing_listing', 'id' => $home->id])->assertCreated();
        $this->postJson('/api/v1/favorites', ['type' => 'marketplace_item', 'id' => 9999])->assertNotFound();

        $this->getJson('/api/v1/favorites/ids')->assertJsonCount(2, 'data');
        $this->getJson('/api/v1/favorites')->assertJsonCount(1, 'data.items')->assertJsonCount(1, 'data.listings');

        $this->deleteJson("/api/v1/favorites/marketplace_item/{$item->id}")->assertOk();
        $this->getJson('/api/v1/favorites/ids')->assertJsonCount(1, 'data');
    }

    /* ---------- Messaging ---------- */

    public function test_messages_follow_the_listing_owner_rules(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $stranger = User::factory()->create();
        $item = $this->item($seller);
        $payload = fn ($to, $text = 'Hello there') => [
            'receiver_id' => $to->id, 'messageable_type' => 'marketplace_item', 'messageable_id' => $item->id, 'content' => $text,
        ];

        Sanctum::actingAs($buyer);
        $this->postJson('/api/v1/messages', $payload($seller))->assertCreated();
        $this->postJson('/api/v1/messages', $payload($buyer))->assertStatus(422);     // to yourself
        $this->postJson('/api/v1/messages', $payload($stranger))->assertStatus(422);  // not the owner
        $this->postJson('/api/v1/messages', [...$payload($seller), 'messageable_id' => 9999])->assertStatus(422);

        Sanctum::actingAs($seller);
        $this->postJson('/api/v1/messages', $payload($buyer, 'Yes, it is available'))->assertCreated();
    }

    public function test_conversations_threads_and_unread_counts(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $item = $this->item($seller, ['title' => 'Blue suit']);

        Message::create(['sender_id' => $buyer->id, 'receiver_id' => $seller->id, 'messageable_type' => MarketplaceItem::class, 'messageable_id' => $item->id, 'content' => 'Is it free Saturday?']);
        Message::create(['sender_id' => $buyer->id, 'receiver_id' => $seller->id, 'messageable_type' => MarketplaceItem::class, 'messageable_id' => $item->id, 'content' => 'Hello?']);

        Sanctum::actingAs($seller);
        $this->getJson('/api/v1/messages/unread-count')->assertJsonPath('data.count', 2);

        $this->getJson('/api/v1/messages/conversations')
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.entity_title', 'Blue suit')
            ->assertJsonPath('data.0.unread_count', 2)
            ->assertJsonPath('data.0.last_message', 'Hello?')
            ->assertJsonPath('data.0.other_user.id', $buyer->id);

        $thread = $this->getJson("/api/v1/messages/thread?with={$buyer->id}&entity_type=marketplace_item&entity_id={$item->id}")
            ->assertOk()->assertJsonCount(2, 'data');
        $this->assertSame('Is it free Saturday?', $thread->json('data.0.content'));

        $this->getJson('/api/v1/messages/unread-count')->assertJsonPath('data.count', 0);
    }

    /* ---------- Account, reports, contact, admin ---------- */

    public function test_members_can_update_profile_switch_role_and_change_password(): void
    {
        $user = User::factory()->create(['role' => 'member', 'password' => 'old-password-1']);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/auth/profile', ['name' => 'New Name', 'role' => 'landlord', 'phone' => '+250788555000'])
            ->assertOk()->assertJsonPath('data.role', 'landlord')->assertJsonPath('data.name', 'New Name');

        $this->patchJson('/api/v1/auth/profile', ['role' => 'admin'])->assertStatus(422);

        $this->postJson('/api/v1/auth/password', ['current_password' => 'wrong', 'password' => 'new-password-1', 'password_confirmation' => 'new-password-1'])
            ->assertStatus(422)->assertJsonValidationErrors('current_password');
        $this->postJson('/api/v1/auth/password', ['current_password' => 'old-password-1', 'password' => 'new-password-1', 'password_confirmation' => 'new-password-1'])
            ->assertOk();
    }

    public function test_listings_can_be_reported_and_the_contact_form_works(): void
    {
        $item = $this->item(User::factory()->create());

        $this->postJson('/api/v1/contact', ['name' => 'A', 'email' => 'a@example.com', 'subject' => 'Hi', 'message' => 'Short'])
            ->assertStatus(422);
        $this->postJson('/api/v1/contact', ['name' => 'A', 'email' => 'a@example.com', 'subject' => 'Question', 'message' => 'I have a question about listing.'])
            ->assertCreated();
        $this->assertDatabaseCount('contact_messages', 1);

        $this->postJson('/api/v1/reports', ['type' => 'marketplace_item', 'id' => $item->id, 'reason' => 'scam'])->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/v1/reports', ['type' => 'marketplace_item', 'id' => $item->id, 'reason' => 'nonsense'])->assertStatus(422);
        $this->postJson('/api/v1/reports', ['type' => 'marketplace_item', 'id' => $item->id, 'reason' => 'scam', 'details' => 'Asked for money first'])->assertCreated();
        $this->assertDatabaseHas('reports', ['reportable_id' => $item->id, 'reason' => 'scam', 'status' => 'open']);
    }

    public function test_only_admins_can_review_kyc_and_reports(): void
    {
        $member = User::factory()->create();
        KycVerification::create([
            'user_id' => $member->id, 'document_type' => 'national_id', 'id_number' => '1',
            'full_name' => 'A', 'id_front_image_path' => 'x', 'status' => 'pending', 'submitted_at' => now(),
        ]);

        Sanctum::actingAs($member);
        $this->getJson('/api/v1/admin/kyc')->assertForbidden();
        $this->getJson('/api/v1/admin/reports')->assertForbidden();

        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->getJson('/api/v1/admin/kyc')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.user.id', $member->id);
        $this->getJson('/api/v1/admin/stats')->assertOk()->assertJsonPath('data.pending_kyc', 1);
    }
}
