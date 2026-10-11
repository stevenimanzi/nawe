<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KycAuditLog extends Model
{
    protected $fillable = [
        'kyc_verification_id',
        'actor_id',
        'action',
        'previous_status',
        'new_status',
        'notes',
        'ip_address',
    ];

    public function kycVerification(): BelongsTo
    {
        return $this->belongsTo(KycVerification::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
