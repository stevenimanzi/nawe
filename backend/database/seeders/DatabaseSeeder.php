<?php

namespace Database\Seeders;

use App\Models\HousingAmenity;
use App\Models\HousingListing;
use App\Models\ItemImage;
use App\Models\MarketplaceItem;
use App\Models\Message;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('Password@123');

        $admin = User::create([
            'name' => 'RP Musanze Admin',
            'email' => 'admin@rp.ac.rw',
            'phone' => '+250788000001',
            'role' => 'admin',
            'password' => $password,
        ]);

        Verification::create([
            'user_id' => $admin->id,
            'registration_number' => 'RP/ADMIN/001',
            'status' => 'verified',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);

        $landlord1 = User::create([
            'name' => 'Jean-Paul Habimana',
            'email' => 'habimana.gueto@gmail.com',
            'phone' => '+250788111222',
            'role' => 'landlord',
            'password' => $password,
        ]);

        Verification::create([
            'user_id' => $landlord1->id,
            'registration_number' => 'LND/MSZ/2024/09',
            'status' => 'verified',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);

        $landlord2 = User::create([
            'name' => 'Chantal Mukamana',
            'email' => 'chantal.rentals@gmail.com',
            'phone' => '+250788333444',
            'role' => 'landlord',
            'password' => $password,
        ]);

        Verification::create([
            'user_id' => $landlord2->id,
            'registration_number' => 'LND/MSZ/2024/15',
            'status' => 'verified',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);

        $student1 = User::create([
            'name' => 'Steven Imanzi',
            'email' => 'steven.imanzi@student.rp.ac.rw',
            'phone' => '+250788555666',
            'role' => 'student',
            'password' => $password,
        ]);

        Verification::create([
            'user_id' => $student1->id,
            'registration_number' => 'RPM/2024/BIT/042',
            'status' => 'verified',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);

        $student2 = User::create([
            'name' => 'Yannick Nshimiyimana',
            'email' => 'yannick.n@student.rp.ac.rw',
            'phone' => '+250788777888',
            'role' => 'student',
            'password' => $password,
        ]);

        Verification::create([
            'user_id' => $student2->id,
            'registration_number' => 'RPM/2024/MECH/108',
            'status' => 'verified',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);

        $listing1 = HousingListing::create([
            'landlord_id' => $landlord1->id,
            'title' => 'Single Studio near RP Musanze Main Gate',
            'description' => 'Self-contained studio room located 250m from Musanze College gate. Tile floors, private prepaid water meter, secure compound with night guard.',
            'monthly_rent' => 35000,
            'deposit' => 35000,
            'rooms' => 1,
            'latitude' => -1.4988200,
            'longitude' => 29.6335100,
            'address' => 'Musanze Sector, Ruhengeri Cell, KG 14 Rd',
            'status' => 'available',
        ]);

        HousingAmenity::create([
            'housing_listing_id' => $listing1->id,
            'has_water' => true,
            'has_wifi' => true,
            'has_electricity' => true,
            'has_parking' => false,
            'is_furnished' => false,
            'distance_to_campus_meters' => 250,
        ]);

        ItemImage::create([
            'imageable_type' => HousingListing::class,
            'imageable_id' => $listing1->id,
            'path' => 'listings/gueto_room_1.jpg',
            'sort_order' => 1,
        ]);

        $listing2 = HousingListing::create([
            'landlord_id' => $landlord2->id,
            'title' => '2-Room Shared Annex for Engineering Students',
            'description' => 'Spacious 2-room annex suitable for sharing between 2 TVET or IT students. High speed fiber Wi-Fi, constant running water, large study desk space.',
            'monthly_rent' => 60000,
            'deposit' => 60000,
            'rooms' => 2,
            'latitude' => -1.5021000,
            'longitude' => 29.6298000,
            'address' => 'Muhoza Sector, Cyivugiza, Near Bus Station',
            'status' => 'available',
        ]);

        HousingAmenity::create([
            'housing_listing_id' => $listing2->id,
            'has_water' => true,
            'has_wifi' => true,
            'has_electricity' => true,
            'has_parking' => true,
            'is_furnished' => true,
            'distance_to_campus_meters' => 650,
        ]);

        ItemImage::create([
            'imageable_type' => HousingListing::class,
            'imageable_id' => $listing2->id,
            'path' => 'listings/gueto_room_2.jpg',
            'sort_order' => 1,
        ]);

        $item1 = MarketplaceItem::create([
            'seller_id' => $student2->id,
            'title' => 'Digital Multimeter & Mechanical Tool Set',
            'description' => 'Precision multimeter, wire strippers, and TVET mechanical workshop toolkit. Perfect for Year 1 & Year 2 RP electrical and mechanical modules.',
            'price' => 28000,
            'category' => 'tvet_tools',
            'condition' => 'like_new',
            'status' => 'active',
        ]);

        ItemImage::create([
            'imageable_type' => MarketplaceItem::class,
            'imageable_id' => $item1->id,
            'path' => 'trade/tvet_multimeter.jpg',
            'sort_order' => 1,
        ]);

        $item2 = MarketplaceItem::create([
            'seller_id' => $student1->id,
            'title' => 'TI-84 Plus Graphic Calculator',
            'description' => 'Graphing calculator for engineering mathematics and statistics courses. Battery included, clean screen with protective slide case.',
            'price' => 35000,
            'category' => 'electronics',
            'condition' => 'good',
            'status' => 'active',
        ]);

        ItemImage::create([
            'imageable_type' => MarketplaceItem::class,
            'imageable_id' => $item2->id,
            'path' => 'trade/calculator.jpg',
            'sort_order' => 1,
        ]);

        $item3 = MarketplaceItem::create([
            'seller_id' => $student2->id,
            'title' => 'Single Gas Cylinder (6kg) with Burner',
            'description' => 'Complete student cooking set: 6kg SP gas cylinder with burner top. 50% gas remaining. Ready for off-campus hostel cooking.',
            'price' => 22000,
            'category' => 'essentials',
            'condition' => 'good',
            'status' => 'active',
        ]);

        ItemImage::create([
            'imageable_type' => MarketplaceItem::class,
            'imageable_id' => $item3->id,
            'path' => 'trade/gas_cylinder.jpg',
            'sort_order' => 1,
        ]);

        Message::create([
            'sender_id' => $student1->id,
            'receiver_id' => $landlord1->id,
            'messageable_type' => HousingListing::class,
            'messageable_id' => $listing1->id,
            'content' => 'Muraho Jean-Paul, is this studio still available for viewing this afternoon after my classes?',
            'read_at' => now(),
        ]);

        Message::create([
            'sender_id' => $landlord1->id,
            'receiver_id' => $student1->id,
            'messageable_type' => HousingListing::class,
            'messageable_id' => $listing1->id,
            'content' => 'Muraho Steven, yes! I will be at the gate around 4 PM. You can reach me on phone.',
            'read_at' => null,
        ]);
    }
}
