<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotarialRequestController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmailCode']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerificationCode']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-recovery', [AuthController::class, 'verifyRecoveryCode']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [ProfileController::class, 'me']);
    Route::put('/me', [ProfileController::class, 'update']);

    Route::get('/availability', [AvailabilityController::class, 'index']);
    Route::post('/availability', [AvailabilityController::class, 'store']);
    Route::put('/availability/{slot}', [AvailabilityController::class, 'update']);
    Route::delete('/availability/{slot}', [AvailabilityController::class, 'destroy']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);

    Route::get('/notarial-requests', [NotarialRequestController::class, 'index']);
    Route::post('/notarial-requests', [NotarialRequestController::class, 'store']);
    Route::put('/notarial-requests/{notarialRequest}/status', [NotarialRequestController::class, 'updateStatus']);

    Route::get('/appointments/{appointment}/messages', [MessageController::class, 'index']);
    Route::post('/appointments/{appointment}/messages', [MessageController::class, 'store']);
});
