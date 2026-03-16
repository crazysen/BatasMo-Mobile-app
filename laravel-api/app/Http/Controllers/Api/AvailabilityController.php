<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AvailabilitySlot;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $query = AvailabilitySlot::query();

        if ($request->user()->role === 'Attorney') {
            $query->where('attorney_id', $request->user()->id);
        }

        return response()->json(['data' => $query->orderBy('start_time')->get()]);
    }

    public function store(Request $request)
    {
        abort_if($request->user()->role !== 'Attorney', 403);

        $validated = $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $slot = AvailabilitySlot::create([
            'attorney_id' => $request->user()->id,
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'is_booked' => false,
        ]);

        return response()->json(['message' => 'Availability slot created.', 'data' => $slot], 201);
    }

    public function update(Request $request, AvailabilitySlot $slot)
    {
        abort_if($request->user()->id !== $slot->attorney_id, 403);

        $validated = $request->validate([
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
            'is_booked' => 'sometimes|boolean',
        ]);

        $slot->fill($validated);
        $slot->save();

        return response()->json(['message' => 'Availability slot updated.', 'data' => $slot]);
    }

    public function destroy(Request $request, AvailabilitySlot $slot)
    {
        abort_if($request->user()->id !== $slot->attorney_id, 403);
        $slot->delete();

        return response()->json(['message' => 'Availability slot deleted.']);
    }
}
