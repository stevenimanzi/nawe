<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HousingListing;
use App\Models\MarketplaceItem;
use App\Models\Report;
use App\Support\Catalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:housing_listing,marketplace_item'],
            'id' => ['required', 'integer'],
            'reason' => ['required', Rule::in(Catalog::REPORT_REASONS)],
            'details' => ['nullable', 'string', 'max:2000'],
        ]);

        $class = $data['type'] === 'housing_listing' ? HousingListing::class : MarketplaceItem::class;

        if (! $class::whereKey($data['id'])->exists()) {
            return response()->json(['message' => 'This listing no longer exists.'], 404);
        }

        Report::create([
            'reporter_id' => $request->user()->id,
            'reportable_type' => $class,
            'reportable_id' => $data['id'],
            'reason' => $data['reason'],
            'details' => $data['details'] ?? null,
        ]);

        return response()->json(['message' => 'Thank you. Our team will review this listing.'], 201);
    }
}
