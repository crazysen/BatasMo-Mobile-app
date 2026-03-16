# BatasMo Laravel API

This folder contains the Laravel backend for Client and Attorney modules.
All mobile requests should go through this API.

## Features in this scaffold

- Auth: register, login, logout
- Email verification code and resend
- Forgot password code verification and reset
- Profiles
- Attorney availability slots
- Client appointments
- Notarial requests (client submit, attorney accept/reject)
- Consultation messages
- Sanctum token auth

## Setup

1. Install PHP 8.2+, Composer, and MySQL/PostgreSQL.
2. From this folder run:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

3. Set your mobile app env:

```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_PC_IP:8000/api
```

For physical-device testing on same network, do not use localhost.
