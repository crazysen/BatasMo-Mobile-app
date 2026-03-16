<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:120',
            'email' => 'required|email|max:120|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:Client,Attorney',
        ]);

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verification_code' => $code,
            'email_verification_expires_at' => now()->addMinutes(10),
        ]);

        // TODO: send email code via notification/mail.

        return response()->json([
            'message' => 'Registration successful. Verify your email code.',
            'data' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    public function verifyEmailCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', strtolower($validated['email']))->firstOrFail();

        if (!$user->email_verification_code || !$user->email_verification_expires_at) {
            throw ValidationException::withMessages(['code' => ['No active verification code.']]);
        }

        if (now()->greaterThan($user->email_verification_expires_at)) {
            throw ValidationException::withMessages(['code' => ['Verification code expired.']]);
        }

        if ($user->email_verification_code !== $validated['code']) {
            throw ValidationException::withMessages(['code' => ['Invalid verification code.']]);
        }

        $user->email_verified_at = now();
        $user->email_verification_code = null;
        $user->email_verification_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Email verified successfully.']);
    }

    public function resendVerificationCode(Request $request)
    {
        $validated = $request->validate(['email' => 'required|email']);

        $user = User::where('email', strtolower($validated['email']))->firstOrFail();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email is already verified.']);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->email_verification_code = $code;
        $user->email_verification_expires_at = now()->addMinutes(10);
        $user->save();

        // TODO: send email code via notification/mail.

        return response()->json(['message' => 'Verification code resent.']);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => ['Invalid credentials.']]);
        }

        if (!$user->email_verified_at) {
            throw ValidationException::withMessages(['email' => ['Email not verified.']]);
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'full_name' => $user->full_name,
                    'role' => $user->role,
                ],
            ],
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate(['email' => 'required|email']);

        $user = User::where('email', strtolower($validated['email']))->firstOrFail();

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->password_reset_code = $code;
        $user->password_reset_expires_at = now()->addMinutes(10);
        $user->save();

        // TODO: send recovery code via mail.

        return response()->json(['message' => 'Recovery code sent.']);
    }

    public function verifyRecoveryCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', strtolower($validated['email']))->firstOrFail();

        if (!$user->password_reset_code || !$user->password_reset_expires_at) {
            throw ValidationException::withMessages(['code' => ['No active recovery code.']]);
        }

        if (now()->greaterThan($user->password_reset_expires_at)) {
            throw ValidationException::withMessages(['code' => ['Recovery code expired.']]);
        }

        if ($user->password_reset_code !== $validated['code']) {
            throw ValidationException::withMessages(['code' => ['Invalid recovery code.']]);
        }

        return response()->json(['message' => 'Recovery code verified.']);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', strtolower($validated['email']))->firstOrFail();

        if (!$user->password_reset_code || !$user->password_reset_expires_at) {
            throw ValidationException::withMessages(['code' => ['No active recovery code.']]);
        }

        if (now()->greaterThan($user->password_reset_expires_at)) {
            throw ValidationException::withMessages(['code' => ['Recovery code expired.']]);
        }

        if ($user->password_reset_code !== $validated['code']) {
            throw ValidationException::withMessages(['code' => ['Invalid recovery code.']]);
        }

        $user->password = Hash::make($validated['password']);
        $user->password_reset_code = null;
        $user->password_reset_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Password reset successful.']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out.']);
    }
}
