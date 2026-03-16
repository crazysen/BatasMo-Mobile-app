<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotarialRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'attorney_id',
        'service_type',
        'details',
        'preferred_date',
        'status',
    ];

    protected $casts = [
        'preferred_date' => 'datetime',
    ];
}
