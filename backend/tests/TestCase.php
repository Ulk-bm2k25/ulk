<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * Indique si les migrations doivent être exécutées
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // S'assurer que la base de données de test existe
        $this->artisan('migrate:fresh');
    }
}