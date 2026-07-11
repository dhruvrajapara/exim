<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HeroSlideController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/hero-slides', [HeroSlideController::class, 'index']);
Route::get('/product-categories', [App\Http\Controllers\ProductCategoryController::class, 'index']);
Route::get('/about-section', [App\Http\Controllers\AboutSectionController::class, 'index']);
Route::get('/featured-products', [App\Http\Controllers\ProductController::class, 'featured']);
Route::get('/certifications', [App\Http\Controllers\CertificationController::class, 'index']);
Route::get('/latest-blogs', [App\Http\Controllers\BlogController::class, 'latest']);
Route::get('/footer', [App\Http\Controllers\FooterSettingController::class, 'index']);

// Admin Routes (Currently Unprotected for testing, later wrapped in auth:sanctum middleware)
Route::prefix('admin')->group(function () {
    Route::get('/hero-slides', [HeroSlideController::class, 'adminIndex']);
    Route::post('/hero-slides', [HeroSlideController::class, 'store']);
    Route::put('/hero-slides/{id}', [HeroSlideController::class, 'update']); // Use POST with _method=PUT to support multipart/form-data
    Route::delete('/hero-slides/{id}', [HeroSlideController::class, 'destroy']);
});
