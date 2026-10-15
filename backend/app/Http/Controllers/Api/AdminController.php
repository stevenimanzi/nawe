<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KycVerificationResource;
use App\Models\HousingListing;
use App\Models\KycVerification;
use App\Models\MarketplaceItem;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function kyc(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $status = $request->query('status', 'pending');

        $records = KycVerification::with('user')
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->orderByDesc('submitted_at')
            ->limit(100)
            ->get()
            ->map(fn (KycVerification $k) => [
                ...(new KycVerificationResource($k))->toArray($request),
                'user' => ['id' => $k->user->id, 'name' => $k->user->name, 'email' => $k->user->email, 'phone' => $k->user->phone],
            ]);

        return response()->json(['data' => $records]);
    }

    public function reports(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $reports = Report::with('reporter')
            ->when($request->query('status', 'open') !== 'all', fn ($q) => $q->where('status', $request->query('status', 'open')))
            ->latest('id')
            ->limit(100)
            ->get()
            ->map(function (Report $r) {
                $entity = $r->reportable_type::withTrashed()->find($r->reportable_id);

                return [
                    'id' => $r->id,
                    'reason' => $r->reason,
                    'details' => $r->details,
                    'status' => $r->status,
                    'created_at' => $r->created_at?->toIso8601String(),
                    'reporter' => ['id' => $r->reporter->id, 'name' => $r->reporter->name],
                    'entity_type' => $r->reportable_type === HousingListing::class ? 'housing_listing' : 'marketplace_item',
                    'entity_id' => $r->reportable_id,
                    'entity_title' => $entity?->title ?? 'Listing removed',
                ];
            });

        return response()->json(['data' => $reports]);
    }

    public function updateReport(Request $request, Report $report): JsonResponse
    {
        $this->authorizeAdmin($request);

        $data = $request->validate(['status' => ['required', 'in:open,reviewed,dismissed']]);
        $report->update($data);

        return response()->json(['message' => 'Report updated', 'data' => ['id' => $report->id, 'status' => $report->status]]);
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json(['data' => [
            'items' => MarketplaceItem::count(),
            'listings' => HousingListing::count(),
            'pending_kyc' => KycVerification::pending()->count(),
            'open_reports' => Report::where('status', 'open')->count(),
        ]]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->isAdmin(), 403, 'Admins only.');
    }
}
