<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inquiry;

class InquiryController extends Controller
{
    /**
     * Store a newly created inquiry from the contact form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'required|string|max:255',
            'product' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $inquiry = Inquiry::create($validated);

        return response()->json([
            'message' => 'Inquiry submitted successfully.',
            'data' => $inquiry
        ], 201);
    }

    /**
     * Display a listing of the inquiries for the admin dashboard.
     */
    public function index()
    {
        $inquiries = Inquiry::orderBy('created_at', 'desc')->get();
        return response()->json($inquiries);
    }

    /**
     * Display the specified inquiry.
     */
    public function show($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        
        // Optionally mark as read when viewed
        if ($inquiry->status === 'new') {
            $inquiry->update(['status' => 'read']);
        }
        
        return response()->json($inquiry);
    }

    /**
     * Update the status of the inquiry.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read'
        ]);

        $inquiry = Inquiry::findOrFail($id);
        $inquiry->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Inquiry status updated successfully.',
            'data' => $inquiry
        ]);
    }

    /**
     * Remove the specified inquiry.
     */
    public function destroy($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->delete();

        return response()->json([
            'message' => 'Inquiry deleted successfully.'
        ]);
    }
}
