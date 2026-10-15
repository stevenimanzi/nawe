<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Orders (and optionally limits) listings by distance from the visitor.
 *
 * Distances are computed in PHP rather than SQL so the same code works on MySQL and SQLite.
 * Without a radius, listings that have no coordinates are placed after the ones that do.
 * With a radius, listings without coordinates are left out because they cannot be placed.
 */
final class Nearby
{
    public static function wanted(Request $request): bool
    {
        return is_numeric($request->query('lat'))
            && is_numeric($request->query('lng'))
            && ($request->query('sort') === 'nearest' || is_numeric($request->query('radius')));
    }

    public static function paginate(Builder $query, Request $request, int $perPage): LengthAwarePaginator
    {
        $lat = (float) $request->query('lat');
        $lng = (float) $request->query('lng');
        $maxKm = is_numeric($request->query('radius')) ? (float) $request->query('radius') : null;

        $all = $query->limit(1000)->get();

        foreach ($all as $model) {
            $model->distance_km = ($model->latitude !== null && $model->longitude !== null)
                ? Catalog::distanceKm($lat, $lng, (float) $model->latitude, (float) $model->longitude)
                : null;
        }

        if ($maxKm !== null) {
            $all = $all->filter(fn ($m) => $m->distance_km !== null && $m->distance_km <= $maxKm);
        }

        $sorted = $all->sort(function ($a, $b) {
            if ($a->distance_km === null && $b->distance_km === null) {
                return 0;
            }
            if ($a->distance_km === null) {
                return 1;
            }
            if ($b->distance_km === null) {
                return -1;
            }

            return $a->distance_km <=> $b->distance_km;
        })->values();

        $page = LengthAwarePaginator::resolveCurrentPage();

        return new LengthAwarePaginator(
            $sorted->forPage($page, $perPage)->values(),
            $sorted->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()],
        );
    }
}
