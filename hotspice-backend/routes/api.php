<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ChefController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\Admin\Api\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\Api\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\Api\RiderController as AdminRiderController;
use App\Http\Controllers\Admin\Api\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\Api\MenuItemController as AdminMenuItemController;
use App\Http\Controllers\Admin\Api\ReservationController as AdminReservationController;
use App\Http\Controllers\Admin\Api\MessageController as AdminMessageController;
use App\Http\Controllers\Admin\Api\UserController as AdminUserController;
use App\Http\Controllers\Admin\Api\DashboardController as AdminDashboardController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::post('/addresses/{id}/default', [AddressController::class, 'setDefault']);
    Route::get('/reservations', [ReservationController::class, 'index']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/menu-items', [MenuItemController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::post('/contact', [ContactMessageController::class, 'store']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/chefs', [ChefController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin.token'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);

        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::patch('/orders/{id}/rider', [AdminOrderController::class, 'assignRider']);

        Route::get('/riders', [AdminRiderController::class, 'index']);
        Route::post('/riders', [AdminRiderController::class, 'store']);
        Route::put('/riders/{id}', [AdminRiderController::class, 'update']);
        Route::delete('/riders/{id}', [AdminRiderController::class, 'destroy']);

        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

        Route::get('/menu-items', [AdminMenuItemController::class, 'index']);
        Route::post('/menu-items', [AdminMenuItemController::class, 'store']);
        Route::put('/menu-items/{id}', [AdminMenuItemController::class, 'update']);
        Route::delete('/menu-items/{id}', [AdminMenuItemController::class, 'destroy']);

        Route::get('/reservations', [AdminReservationController::class, 'index']);
        Route::patch('/reservations/{id}/status', [AdminReservationController::class, 'updateStatus']);

        Route::get('/messages', [AdminMessageController::class, 'index']);
        Route::patch('/messages/{id}/read', [AdminMessageController::class, 'markRead']);
        Route::delete('/messages/{id}', [AdminMessageController::class, 'destroy']);

        Route::get('/users', [AdminUserController::class, 'index']);

        Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);
    });
});