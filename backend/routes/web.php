<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::get('/{any}', function () {
    // In production, the React build index.html will be located in public_html
    // which is the parent directory's public_html folder.
    // For local development, we just return a message indicating the SPA handles this,
    // or we redirect to the local Vite dev server port.
    
    // Check if we are running in local environment
    if (app()->environment('local')) {
        return response("Local Development: Please run the React frontend on port 5173 (http://localhost:5173). Laravel API is running successfully.", 200)
            ->header('Content-Type', 'text/plain');
    }

    // Production: serve the React index.html
    // Assuming structure: /home/laravel/ and /home/public_html/
    $path = public_path('../public_html/index.html');
    
    if (File::exists($path)) {
        return file_get_contents($path);
    }
    
    return response('React frontend build not found.', 404);
})->where('any', '.*');
