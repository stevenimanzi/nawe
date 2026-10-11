<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Jean de Dieu',
            'email' => 'jean@student.rp.ac.rw',
            'phone' => '+250788999888',
            'role' => 'student',
            'password' => 'Password@123',
            'password_confirmation' => 'Password@123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'jean@student.rp.ac.rw',
            'role' => 'student',
        ]);
    }

    public function test_user_can_login_and_access_profile(): void
    {
        $user = User::factory()->create([
            'email' => 'test@rp.ac.rw',
            'password' => 'secret123',
        ]);

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@rp.ac.rw',
            'password' => 'secret123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                    'user' => ['id', 'email'],
                ],
            ]);

        $token = $loginResponse->json('data.token');

        $profileResponse = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/auth/me');

        $profileResponse->assertStatus(200)
            ->assertJsonPath('data.email', 'test@rp.ac.rw');
    }
}
