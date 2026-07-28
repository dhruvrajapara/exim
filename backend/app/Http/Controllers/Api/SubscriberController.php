<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    /**
     * Store a new subscriber (Public)
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        // Use firstOrCreate to prevent duplicates while returning success
        $subscriber = Subscriber::firstOrCreate(
            ['email' => $request->email],
            ['status' => 'active']
        );

        return response()->json([
            'success' => true,
            'message' => 'Successfully subscribed to the newsletter!',
            'data' => $subscriber
        ]);
    }

    /**
     * Get all subscribers (Admin)
     */
    public function index()
    {
        $subscribers = Subscriber::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $subscribers
        ]);
    }

    /**
     * Delete a subscriber (Admin)
     */
    public function destroy($id)
    {
        $subscriber = Subscriber::find($id);
        
        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Subscriber not found'
            ], 404);
        }

        $subscriber->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscriber deleted successfully'
        ]);
    }
}
