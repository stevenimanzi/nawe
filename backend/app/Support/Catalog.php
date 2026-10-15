<?php

namespace App\Support;

/** Allowed values shared by validation, filters and the seeder. */
final class Catalog
{
    /** 'tvet_tools' is kept so older records stay valid. */
    public const ITEM_CATEGORIES = [
        'phones',
        'electronics',
        'furniture',
        'appliances',
        'vehicles',
        'tools',
        'clothing',
        'books',
        'essentials',
        'other',
        'tvet_tools',
    ];

    public const CONDITIONS = ['new', 'like_new', 'good', 'fair'];

    public const LISTING_TYPES = ['sale', 'rent'];

    public const RENT_PERIODS = ['day', 'week', 'month'];

    public const PROPERTY_TYPES = ['room', 'studio', 'house', 'apartment'];

    public const REPORT_REASONS = ['scam', 'prohibited', 'wrong_info', 'offensive', 'duplicate', 'other'];

    public const AMENITY_COLUMNS = [
        'water' => 'has_water',
        'electricity' => 'has_electricity',
        'wifi' => 'has_wifi',
        'parking' => 'has_parking',
        'furnished' => 'is_furnished',
    ];

    /** Great-circle distance in kilometres. */
    public static function distanceKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earth = 6371.0;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return $earth * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
