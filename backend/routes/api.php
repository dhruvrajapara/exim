<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HeroSlideController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/hero-slides', [HeroSlideController::class, 'index']);
Route::get('/product-categories', [App\Http\Controllers\ProductCategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/gallery-images', [\App\Http\Controllers\Api\GalleryImageController::class, 'index']);
Route::get('/about-section', [App\Http\Controllers\AboutSectionController::class, 'index']);
Route::get('/featured-products', [App\Http\Controllers\ProductController::class, 'featured']);
Route::get('/certifications', [App\Http\Controllers\CertificationController::class, 'index']);
Route::get('/testimonials', [App\Http\Controllers\TestimonialController::class, 'index']);
Route::get('/latest-blogs', [App\Http\Controllers\BlogController::class, 'latest']);
Route::get('/blogs', [App\Http\Controllers\BlogController::class, 'index']);
Route::get('/blogs/featured', [App\Http\Controllers\BlogController::class, 'featured']);
Route::get('/blogs/related/{categorySlug}', [App\Http\Controllers\BlogController::class, 'related']);
Route::get('/blogs/{slug}', [App\Http\Controllers\BlogController::class, 'show']);
Route::get('/blog-categories', [App\Http\Controllers\BlogCategoryController::class, 'index']);
Route::get('/footer', [App\Http\Controllers\FooterSettingController::class, 'index']);
Route::get('/team-members', [App\Http\Controllers\TeamMemberController::class, 'index']);
Route::get('/website/settings', [\App\Http\Controllers\Api\WebsiteSettingController::class, 'getSettings']);
Route::get('/website/available-pages', [\App\Http\Controllers\Api\WebsiteSettingController::class, 'getAvailablePages']);
Route::post('/inquiries', [\App\Http\Controllers\Api\InquiryController::class, 'store']);

// Admin Routes (Currently Unprotected for testing, later wrapped in auth:sanctum middleware)
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);
    
    // Admin Blog Categories
    Route::post('/blog-categories', [App\Http\Controllers\BlogCategoryController::class, 'store']);
    Route::put('/blog-categories/{id}', [App\Http\Controllers\BlogCategoryController::class, 'update']);
    Route::delete('/blog-categories/{id}', [App\Http\Controllers\BlogCategoryController::class, 'destroy']);

    // Admin Blogs
    Route::get('/blogs', [App\Http\Controllers\BlogController::class, 'adminIndex']);
    Route::post('/blogs', [App\Http\Controllers\BlogController::class, 'store']);
    Route::put('/blogs/{id}', [App\Http\Controllers\BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [App\Http\Controllers\BlogController::class, 'destroy']);

    Route::get('/hero-slides', [HeroSlideController::class, 'adminIndex']);
    Route::post('/hero-slides', [HeroSlideController::class, 'store']);
    Route::put('/hero-slides/{id}', [HeroSlideController::class, 'update']); // Use POST with _method=PUT to support multipart/form-data
    Route::delete('/hero-slides/{id}', [HeroSlideController::class, 'destroy']);
    
    Route::get('/about-section', [App\Http\Controllers\AboutSectionController::class, 'adminIndex']);
    Route::put('/about-section/{id}', [App\Http\Controllers\AboutSectionController::class, 'update']);

    // Product Categories
    Route::get('/product-categories', [App\Http\Controllers\ProductCategoryController::class, 'adminIndex']);
    Route::post('/product-categories', [App\Http\Controllers\ProductCategoryController::class, 'store']);
    Route::put('/product-categories/{id}', [App\Http\Controllers\ProductCategoryController::class, 'update']);
    Route::delete('/product-categories/{id}', [App\Http\Controllers\ProductCategoryController::class, 'destroy']);

    // Products
    Route::get('/products', [App\Http\Controllers\ProductController::class, 'adminIndex']);
    Route::post('/products', [App\Http\Controllers\ProductController::class, 'store']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [App\Http\Controllers\ProductController::class, 'destroy']);

    // Gallery Admin
    Route::post('/gallery-images', [\App\Http\Controllers\Api\GalleryImageController::class, 'store']);
    Route::post('/gallery-images/{id}', [\App\Http\Controllers\Api\GalleryImageController::class, 'update']);
    Route::delete('/gallery-images/{id}', [\App\Http\Controllers\Api\GalleryImageController::class, 'destroy']);

    // Certifications
    Route::get('/certifications', [App\Http\Controllers\CertificationController::class, 'adminIndex']);
    Route::post('/certifications', [App\Http\Controllers\CertificationController::class, 'store']);
    Route::post('/certifications/{id}', [App\Http\Controllers\CertificationController::class, 'update']); // Use POST to support multipart/form-data for image uploads
    Route::delete('/certifications/{id}', [App\Http\Controllers\CertificationController::class, 'destroy']);

    // Testimonials
    Route::get('/testimonials', [App\Http\Controllers\TestimonialController::class, 'adminIndex']);
    Route::post('/testimonials', [App\Http\Controllers\TestimonialController::class, 'store']);
    Route::post('/testimonials/{id}', [App\Http\Controllers\TestimonialController::class, 'update']); // Use POST to support multipart/form-data for image uploads
    Route::delete('/testimonials/{id}', [App\Http\Controllers\TestimonialController::class, 'destroy']);

    // Team Members
    Route::get('/team-members', [App\Http\Controllers\TeamMemberController::class, 'adminIndex']);
    Route::post('/team-members', [App\Http\Controllers\TeamMemberController::class, 'store']);
    Route::post('/team-members/{id}', [App\Http\Controllers\TeamMemberController::class, 'update']); // POST for FormData
    Route::delete('/team-members/{id}', [App\Http\Controllers\TeamMemberController::class, 'destroy']);
    Route::patch('/team-members/{id}/status', [App\Http\Controllers\TeamMemberController::class, 'updateStatus']);
    Route::patch('/team-members/reorder', [App\Http\Controllers\TeamMemberController::class, 'reorder']);

    // Vision Mission
    Route::get('/vision-mission', [\App\Http\Controllers\VisionMissionController::class, 'adminIndex']);
    Route::post('/vision-mission', [\App\Http\Controllers\VisionMissionController::class, 'store']);
    Route::put('/vision-mission/{id}', [\App\Http\Controllers\VisionMissionController::class, 'update']);
    Route::delete('/vision-mission/{id}', [\App\Http\Controllers\VisionMissionController::class, 'destroy']);

    // Why Choose Us
    Route::get('/why-choose-us', [\App\Http\Controllers\WhyChooseUsController::class, 'adminIndex']);
    Route::post('/why-choose-us', [\App\Http\Controllers\WhyChooseUsController::class, 'store']);
    Route::put('/why-choose-us/{id}', [\App\Http\Controllers\WhyChooseUsController::class, 'update']);
    Route::delete('/why-choose-us/{id}', [\App\Http\Controllers\WhyChooseUsController::class, 'destroy']);

    // Section Settings
    Route::put('/section-settings/{key}', [App\Http\Controllers\SectionSettingController::class, 'update']);
    
    // Global Settings
    Route::put('/website/settings', [\App\Http\Controllers\Api\WebsiteSettingController::class, 'updateSettings']);

    // Inquiries
    Route::get('/inquiries', [\App\Http\Controllers\Api\InquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [\App\Http\Controllers\Api\InquiryController::class, 'show']);
    Route::put('/inquiries/{id}/status', [\App\Http\Controllers\Api\InquiryController::class, 'updateStatus']);
    Route::delete('/inquiries/{id}', [\App\Http\Controllers\Api\InquiryController::class, 'destroy']);
});

// Public Vision Mission Route
Route::get('/vision-mission', [\App\Http\Controllers\VisionMissionController::class, 'index']);

// Public Why Choose Us Route
Route::get('/why-choose-us', [\App\Http\Controllers\WhyChooseUsController::class, 'index']);

// Public Section Settings Route
Route::get('/section-settings/{key}', [App\Http\Controllers\SectionSettingController::class, 'index']);
