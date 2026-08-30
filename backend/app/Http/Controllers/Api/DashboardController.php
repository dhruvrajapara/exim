<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Blog;
use App\Models\Inquiry;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $activeEnquiries = Inquiry::where('status', 'new')->count();
        $publishedBlogs = Blog::count();
        $totalUsers = User::count();

        $recentEnquiries = Inquiry::orderBy('created_at', 'desc')->take(5)->get();

        $gscService = new \App\Services\GoogleSearchConsoleService();
        $gscData = null;
        if ($gscService->isConnected()) {
            $gscData = $gscService->getAnalyticsData(30);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_products' => $totalProducts,
                    'active_enquiries' => $activeEnquiries,
                    'published_blogs' => $publishedBlogs,
                    'total_users' => $totalUsers
                ],
                'recent_enquiries' => $recentEnquiries,
                'gsc' => [
                    'connected' => $gscService->isConnected(),
                    'data' => $gscData
                ]
            ]
        ]);
    }
}
