<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of the resource for public frontend.
     */
    public function index()
    {
        try {
            $teamMembers = TeamMember::active()->ordered()->get();
            
            // Format to match frontend expectations
            $formattedData = $teamMembers->map(function ($member) {
                return [
                    'id' => $member->id,
                    'full_name' => $member->name,
                    'role' => $member->designation,
                    'profile_image' => $member->image ? url($member->image) : null,
                    'short_description' => $member->description,
                    'social_links' => [
                        'linkedin' => $member->linkedin,
                        'email' => $member->email,
                        'whatsapp' => $member->whatsapp,
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Team members fetched successfully.',
                'data' => $formattedData
            ]);
        } catch (\Throwable $e) {
            Log::error('Error fetching team members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch team members.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the resource for Admin panel.
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = TeamMember::query();

            // Search
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('designation', 'like', "%{$search}%");
                });
            }

            // Filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status === 'active');
            }
            if ($request->has('featured') && $request->featured !== 'all') {
                $query->where('featured', $request->featured === 'true');
            }

            // Order
            $query->orderBy('display_order', 'asc')->orderBy('id', 'desc');

            $teamMembers = $query->get();

            return response()->json([
                'success' => true,
                'message' => 'Admin team members fetched successfully.',
                'data' => $teamMembers
            ]);
        } catch (\Throwable $e) {
            Log::error('Error fetching admin team members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch admin team members.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        set_error_handler(function($errno, $errstr, $errfile, $errline) {
            throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
        });

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'designation' => 'required|string|max:255',
                'description' => 'nullable|string',
                'email' => 'nullable|email|max:255',
                'linkedin' => 'nullable|url|max:255',
                'whatsapp' => 'nullable|string|max:50',
                'display_order' => 'nullable|integer',
                'featured' => 'nullable|boolean',
                'status' => 'nullable|boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/team'), $filename);
                $imagePath = '/uploads/team/' . $filename;
            }

            $teamMember = TeamMember::create([
                'name' => $validated['name'],
                'designation' => $validated['designation'],
                'description' => $validated['description'] ?? null,
                'image' => $imagePath,
                'email' => $validated['email'] ?? null,
                'linkedin' => $validated['linkedin'] ?? null,
                'whatsapp' => $validated['whatsapp'] ?? null,
                'display_order' => $validated['display_order'] ?? 0,
                'featured' => $validated['featured'] ?? false,
                'status' => $validated['status'] ?? true,
            ]);

            restore_error_handler();

            if (ob_get_length()) {
                ob_clean();
            }

            return response()->json([
                'success' => true,
                'message' => 'Team member created successfully.',
                'data' => $teamMember
            ], 201);
        } catch (\Throwable $e) {
            restore_error_handler();
            Log::error('Error creating team member: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create team member.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        set_error_handler(function($errno, $errstr, $errfile, $errline) {
            throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
        });

        try {
            $teamMember = TeamMember::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'designation' => 'required|string|max:255',
                'description' => 'nullable|string',
                'email' => 'nullable|email|max:255',
                'linkedin' => 'nullable|url|max:255',
                'whatsapp' => 'nullable|string|max:50',
                'display_order' => 'nullable|integer',
                'featured' => 'nullable|boolean',
                'status' => 'nullable|boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            if ($request->hasFile('image')) {
                // Delete old image
                if ($teamMember->image && file_exists(public_path($teamMember->image))) {
                    @unlink(public_path($teamMember->image));
                }

                $file = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/team'), $filename);
                $teamMember->image = '/uploads/team/' . $filename;
            }

            $teamMember->name = $validated['name'];
            $teamMember->designation = $validated['designation'];
            $teamMember->description = $validated['description'] ?? null;
            $teamMember->email = $validated['email'] ?? null;
            $teamMember->linkedin = $validated['linkedin'] ?? null;
            $teamMember->whatsapp = $validated['whatsapp'] ?? null;
            
            if (isset($validated['display_order'])) {
                $teamMember->display_order = $validated['display_order'];
            }
            if (isset($validated['featured'])) {
                $teamMember->featured = $validated['featured'];
            }
            if (isset($validated['status'])) {
                $teamMember->status = $validated['status'];
            }

            $teamMember->save();

            restore_error_handler();

            if (ob_get_length()) {
                ob_clean();
            }

            return response()->json([
                'success' => true,
                'message' => 'Team member updated successfully.',
                'data' => $teamMember
            ]);
        } catch (\Throwable $e) {
            restore_error_handler();
            Log::error('Error updating team member: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update team member.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $teamMember = TeamMember::findOrFail($id);

            // Delete image
            if ($teamMember->image && file_exists(public_path($teamMember->image))) {
                @unlink(public_path($teamMember->image));
            }

            $teamMember->delete();

            return response()->json([
                'success' => true,
                'message' => 'Team member deleted successfully.'
            ]);
        } catch (\Throwable $e) {
            Log::error('Error deleting team member: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete team member.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update status only.
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $teamMember = TeamMember::findOrFail($id);
            
            $validated = $request->validate([
                'status' => 'required|boolean',
            ]);

            $teamMember->status = $validated['status'];
            $teamMember->save();

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully.',
                'data' => $teamMember
            ]);
        } catch (\Throwable $e) {
            Log::error('Error updating team member status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder team members.
     */
    public function reorder(Request $request)
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array',
                'items.*.id' => 'required|integer|exists:team_members,id',
                'items.*.display_order' => 'required|integer',
            ]);

            foreach ($validated['items'] as $item) {
                TeamMember::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully.'
            ]);
        } catch (\Throwable $e) {
            Log::error('Error reordering team members: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
