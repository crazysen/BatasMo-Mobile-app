<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotarialRequest;
use Illuminate\Http\Request;

class NotarialRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $requests = NotarialRequest::query()
            ->when($user->role === 'Client', fn ($q) => $q->where('client_id', $user->id))
            ->when($user->role === 'Attorney', fn ($q) => $q->where(function ($sub) use ($user) {
                $sub->whereNull('attorney_id')->orWhere('attorney_id', $user->id);
            }))
            ->latest()
            ->get();

        return response()->json(['data' => $requests]);
    }

    public function store(Request $request)
    {
        abort_if($request->user()->role !== 'Client', 403);

        $validated = $request->validate([
            'service_type' => 'required|string|max:120',
            'details' => 'nullable|string|max:2000',
            'preferred_date' => 'nullable|date',
        ]);

        $record = NotarialRequest::create([
            'client_id' => $request->user()->id,
            'service_type' => $validated['service_type'],
            'details' => $validated['details'] ?? null,
            'preferred_date' => $validated['preferred_date'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Notarial request submitted.', 'data' => $record], 201);
    }

    public function updateStatus(Request $request, NotarialRequest $notarialRequest)
    {
        $user = $request->user();

        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected,completed,cancelled',
        ]);

        if ($user->role === 'Attorney') {
            if ($notarialRequest->attorney_id && $notarialRequest->attorney_id !== $user->id) {
                abort(403);
            }

            if (!$notarialRequest->attorney_id) {
                $notarialRequest->attorney_id = $user->id;
            }
        } else {
            abort_if($user->id !== $notarialRequest->client_id, 403);
        }

        $notarialRequest->status = $validated['status'];
        $notarialRequest->save();

        return response()->json(['message' => 'Notarial request updated.', 'data' => $notarialRequest]);
    }
}
