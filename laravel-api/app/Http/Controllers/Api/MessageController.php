<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Appointment $appointment)
    {
        $userId = $request->user()->id;
        abort_if($userId !== $appointment->client_id && $userId !== $appointment->attorney_id, 403);

        $messages = Message::where('appointment_id', $appointment->id)
            ->orderBy('created_at')
            ->get();

        return response()->json(['data' => $messages]);
    }

    public function store(Request $request, Appointment $appointment)
    {
        $userId = $request->user()->id;
        abort_if($userId !== $appointment->client_id && $userId !== $appointment->attorney_id, 403);

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $message = Message::create([
            'appointment_id' => $appointment->id,
            'sender_id' => $userId,
            'message' => $validated['message'],
        ]);

        return response()->json(['message' => 'Message sent.', 'data' => $message], 201);
    }
}
