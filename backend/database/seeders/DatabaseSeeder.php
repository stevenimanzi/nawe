<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\HousingAmenity;
use App\Models\HousingListing;
use App\Models\ItemImage;
use App\Models\KycVerification;
use App\Models\MarketplaceItem;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * DEMO DATA ONLY. Run `php artisan migrate:fresh --seed` on a development machine to get a
 * working site to click through. Do not seed a production database.
 *
 * Every account uses the password: Password@123
 * Photos are Unsplash images (disk "url"), so no uploads are needed.
 */
class DatabaseSeeder extends Seeder
{
    private const PLACES = [
        'Musanze' => [-1.4994, 29.6335],
        'Kigali' => [-1.9441, 30.0619],
        'Huye' => [-2.5967, 29.7394],
        'Rubavu' => [-1.6779, 29.2606],
        'Muhanga' => [-2.0846, 29.7569],
    ];

    private function photo(string $id): string
    {
        return "https://images.unsplash.com/{$id}?auto=format&fit=crop&w=1400&q=80";
    }

    private function image($model, string $id, int $order = 0): void
    {
        $model->images()->create(['path' => $this->photo($id), 'disk' => 'url', 'sort_order' => $order]);
    }

    private function kyc(User $user, string $status, string $number): void
    {
        KycVerification::create([
            'user_id' => $user->id,
            'document_type' => 'national_id',
            'id_number' => $number,
            'full_name' => $user->name,
            'id_front_image_path' => 'kyc/ids/demo_front.jpg',
            'status' => $status,
            'submitted_at' => now()->subDays(2),
            'reviewed_at' => $status === 'approved' ? now()->subDay() : null,
        ]);
    }

    private function item(User $seller, array $data, string $photoId, string $place): MarketplaceItem
    {
        [$lat, $lng] = self::PLACES[$place];

        $item = MarketplaceItem::create([
            'seller_id' => $seller->id,
            'listing_type' => 'sale',
            'location' => $place,
            'latitude' => $lat + (mt_rand(-80, 80) / 1000),
            'longitude' => $lng + (mt_rand(-80, 80) / 1000),
            'status' => 'active',
            ...$data,
        ]);

        $this->image($item, $photoId);

        return $item;
    }

    private function home(User $landlord, array $data, array $amenities, string $place, array $photoIds): HousingListing
    {
        [$lat, $lng] = self::PLACES[$place];

        $listing = HousingListing::create([
            'landlord_id' => $landlord->id,
            'location' => $place,
            'latitude' => $lat + (mt_rand(-60, 60) / 1000),
            'longitude' => $lng + (mt_rand(-60, 60) / 1000),
            'status' => 'available',
            ...$data,
        ]);

        HousingAmenity::create(['housing_listing_id' => $listing->id, ...$amenities]);

        foreach ($photoIds as $order => $id) {
            $this->image($listing, $id, $order);
        }

        return $listing;
    }

    public function run(): void
    {
        $password = Hash::make('Password@123');

        $admin = User::create([
            'name' => 'NAWE Admin', 'email' => 'admin@nawe.rw', 'phone' => '+250796194401',
            'role' => 'admin', 'password' => $password,
        ]);

        $landlord = User::create([
            'name' => 'Jean-Paul Habimana', 'email' => 'landlord@nawe.rw', 'phone' => '+250788000101',
            'role' => 'landlord', 'password' => $password,
        ]);
        $this->kyc($landlord, 'approved', '1198080012345678');

        $seller = User::create([
            'name' => 'Chantal Mukamana', 'email' => 'seller@nawe.rw', 'phone' => '+250788000102',
            'role' => 'member', 'password' => $password,
        ]);
        $this->kyc($seller, 'approved', '1199570087654321');

        $buyer = User::create([
            'name' => 'Yannick Nshimiyimana', 'email' => 'buyer@nawe.rw', 'phone' => '+250788000103',
            'role' => 'member', 'password' => $password,
        ]);

        $pending = User::create([
            'name' => 'Aline Uwase', 'email' => 'pending@nawe.rw', 'phone' => '+250788000104',
            'role' => 'member', 'password' => $password,
        ]);
        $this->kyc($pending, 'pending', '1200070011223344');

        $suit = $this->item($seller, [
            'title' => 'Navy suit for rent (jacket and trousers)',
            'description' => 'Clean two-piece navy suit, size 40. Ideal for interviews, weddings and graduations. Dry-cleaned between rentals. Deposit refunded on return.',
            'price' => 8000, 'category' => 'clothing', 'condition' => 'like_new',
            'listing_type' => 'rent', 'rent_period' => 'day',
        ], 'photo-1617137984095-74e4e5e3613f', 'Musanze');

        $this->item($seller, [
            'title' => 'Front-load washing machine, 7kg (rent by the day)',
            'description' => 'Working 7kg front-loader, pick-up only. Great if you are between houses or need a heavy wash. Detergent not included.',
            'price' => 5000, 'category' => 'appliances', 'condition' => 'good',
            'listing_type' => 'rent', 'rent_period' => 'day',
        ], 'photo-1626806787461-102c1bfaaea1', 'Musanze');

        $this->item($seller, [
            'title' => 'Samsung Galaxy A12, 64GB, good condition',
            'description' => 'Used for one year with a case and screen protector since day one. Battery lasts a full day. Charger and box included.',
            'price' => 85000, 'category' => 'phones', 'condition' => 'good',
        ], 'photo-1592890288564-76628a30a657', 'Kigali');

        $this->item($landlord, [
            'title' => 'MacBook Pro 13", 2015, 8GB RAM',
            'description' => 'Runs smoothly for study, office work and light design. New battery fitted last year. Comes with charger.',
            'price' => 450000, 'category' => 'electronics', 'condition' => 'good',
        ], 'photo-1496181133206-80ce9b88a853', 'Huye');

        $sofa = $this->item($landlord, [
            'title' => '3-seater grey sofa, moving out',
            'description' => 'Comfortable fabric sofa in a light grey, no tears or stains. I am relocating this week, so the price is firm but fair. Buyer collects.',
            'price' => 150000, 'category' => 'furniture', 'condition' => 'like_new', 'is_urgent' => true,
        ], 'photo-1759722665629-29df6ee4f9a5', 'Musanze');

        $this->item($seller, [
            'title' => 'Honda 125cc motorcycle, 2018',
            'description' => 'Reliable commuter motorcycle, recently serviced, papers up to date. Test ride possible after you message me.',
            'price' => 1200000, 'category' => 'vehicles', 'condition' => 'good',
        ], 'photo-1641295437743-2ea0b8453392', 'Rubavu');

        $this->item($landlord, [
            'title' => 'Cordless drill and hammer set',
            'description' => 'Cordless drill with two batteries, plus a claw hammer and stud finder. Works perfectly, selling because I upgraded.',
            'price' => 45000, 'category' => 'tools', 'condition' => 'good', 'is_urgent' => true,
        ], 'photo-1606676539940-12768ce0e762', 'Muhanga');

        $this->item($landlord, [
            'title' => 'Power drill kit to rent for home projects',
            'description' => 'Borrow my drill kit for shelves, curtains and small repairs. Bits included. Return it clean and charged.',
            'price' => 3000, 'category' => 'tools', 'condition' => 'good',
            'listing_type' => 'rent', 'rent_period' => 'day',
        ], 'photo-1518709414768-a88981a4515d', 'Musanze');

        $room = $this->home($landlord, [
            'title' => 'Furnished room with private bathroom in Nyakinama',
            'description' => 'Bright furnished room in a quiet compound, 10 minutes from the main road. Water and electricity included, Wi-Fi available. Landlord lives next door.',
            'monthly_rent' => 55000, 'deposit' => 55000, 'rooms' => 1, 'property_type' => 'room',
            'address' => 'Nyakinama, Musanze',
        ], ['has_water' => true, 'has_wifi' => true, 'has_electricity' => true, 'has_parking' => false, 'is_furnished' => true, 'distance_to_campus_meters' => 600],
            'Musanze', ['photo-1522708323590-d24dbb6b0267']);

        $this->home($landlord, [
            'title' => 'Two-bedroom house with parking, Kigali',
            'description' => 'Spacious house with a small garden and secure parking. Close to public transport and shops. Suitable for a family or two sharing.',
            'monthly_rent' => 220000, 'deposit' => 440000, 'rooms' => 2, 'property_type' => 'house',
            'address' => 'Kimironko, Kigali',
        ], ['has_water' => true, 'has_wifi' => false, 'has_electricity' => true, 'has_parking' => true, 'is_furnished' => false],
            'Kigali', ['photo-1708772565599-2c4e4b3ed9db']);

        $this->home($landlord, [
            'title' => 'Self-contained studio near the university, Huye',
            'description' => 'Clean studio with its own kitchenette and entrance. Walking distance to campus. Water and electricity bills are separate.',
            'monthly_rent' => 40000, 'deposit' => 40000, 'rooms' => 1, 'property_type' => 'studio',
            'address' => 'Tumba, Huye',
        ], ['has_water' => true, 'has_wifi' => false, 'has_electricity' => true, 'has_parking' => false, 'is_furnished' => false, 'distance_to_campus_meters' => 400],
            'Huye', ['photo-1522708323590-d24dbb6b0267']);

        Message::create([
            'sender_id' => $buyer->id, 'receiver_id' => $seller->id,
            'messageable_type' => MarketplaceItem::class, 'messageable_id' => $suit->id,
            'content' => 'Hello! Is the suit still available for this Saturday? I am about 1.80m tall.',
        ]);
        Message::create([
            'sender_id' => $seller->id, 'receiver_id' => $buyer->id,
            'messageable_type' => MarketplaceItem::class, 'messageable_id' => $suit->id,
            'content' => 'Hi Yannick, yes it is free on Saturday. Size 40 should fit you well.',
            'read_at' => null,
        ]);

        Favorite::create(['user_id' => $buyer->id, 'favoritable_type' => MarketplaceItem::class, 'favoritable_id' => $sofa->id]);
        Favorite::create(['user_id' => $buyer->id, 'favoritable_type' => HousingListing::class, 'favoritable_id' => $room->id]);

        // Keep the admin reachable for KYC reviews.
        unset($admin);
    }
}
