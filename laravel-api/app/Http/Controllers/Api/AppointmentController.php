<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $appointments = Appointment::query()
            ->when($user->role === 'Client', fn ($q) => $q->where('client_id', $user->id))
            ->when($user->role === 'Attorney', fn ($q) => $q->where('attorney_id', $user->id))
            ->orderByDesc('scheduled_at')
            ->get();

        return response()->json(['data' => $appointments]);
    }

    public function store(Request $request)
    {
        abort_if($request->user()->role !== 'Client', 403);

        $validated = $request->validate([
            'attorney_id' => 'required|exists:users,id',
            'availability_slot_id' => 'nullable|exists:availability_slots,id',
            'title' => 'required|string|max:120',
            'notes' => 'nullable|string|max:1000',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'required|integer|min:15|max:240',
        ]);

        if (!empty($validated['availability_slot_id'])) {
            $slot = AvailabilitySlot::findOrFail($validated['availability_slot_id']);
            abort_if($slot->is_booked, 422, 'Selected slot is already booked.');
            $slot->is_booked = true;
            $slot->save();
        }

        $appointment = Appointment::create([
            'client_id' => $request->user()->id,
            'attorney_id' => $validated['attorney_id'],
            'availability_slot_id' => $validated['availability_slot_id'] ?? null,
            'title' => $validated['title'],
            'notes' => $validated['notes'] ?? null,
            'scheduled_at' => $validated['scheduled_at'],
            'duration_minutes' => $validated['duration_minutes'],
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Appointment created.', 'data' => $appointment], 201);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $user = $request->user();
        abort_if($user->id !== $appointment->client_id && $user->id !== $appointment->attorney_id, 403);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled,rescheduled',
        ]);

        $appointment->status = $validated['status'];
        $appointment->save();

        return response()->json(['message' => 'Appointment status updated.', 'data' => $appointment]);
    }
}
