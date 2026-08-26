<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::orderByDesc('created_at')->get();

        return response()->json($messages);
    }

    public function markRead(Request $request, string $id)
    {
        $validated = $request->validate([
            'is_read' => 'boolean',
        ]);

        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => $validated['is_read'] ?? true]);

        return response()->json($message);
    }

    public function destroy(string $id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
